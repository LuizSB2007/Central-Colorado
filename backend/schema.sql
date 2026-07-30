-- ============================================================
-- 1. TIPOS ENUM
-- ============================================================
CREATE TYPE shopping_item_status AS ENUM ('A_COMPRAR', 'COMPRADO');

-- ============================================================
-- 2. FUNÇÕES UTILITÁRIAS
-- ============================================================
-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- 3. TABELAS E CHAVES
-- ============================================================

-- Tabela: profiles
-- Relacionada 1:1 com auth.users do Supabase
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: cleaning_rooms
CREATE TABLE cleaning_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    order_index INTEGER NOT NULL UNIQUE
);

-- Tabela: cleaning_assignments
CREATE TABLE cleaning_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES cleaning_rooms(id) ON DELETE CASCADE,
    cycle_number INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, cycle_number) -- Um usuário tem apenas 1 cômodo por ciclo
);

-- Trigger para cleaning_assignments
CREATE TRIGGER update_cleaning_assignments_modtime
    BEFORE UPDATE ON cleaning_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Tabela: shopping_items
CREATE TABLE shopping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status shopping_item_status DEFAULT 'A_COMPRAR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: notices
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: punishments (Babalorado / Vacilômetro)
CREATE TABLE punishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    given_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    received_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 4. ÍNDICES DE PERFORMANCE
-- ============================================================
CREATE INDEX idx_cleaning_assignments_cycle ON cleaning_assignments(cycle_number);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_punishments_created_at ON punishments(created_at);

-- ============================================================
-- 5. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ============================================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE punishments ENABLE ROW LEVEL SECURITY;

-- Profiles: Todos autenticados podem ver, mas só o próprio usuário pode editar
CREATE POLICY "Profiles são visíveis por usuários autenticados" ON profiles
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem atualizar seus próprios profiles" ON profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir seus próprios profiles" ON profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Restante: Como é um app interno da república, permitiremos que qualquer
-- usuário autenticado faça operações CRUD, desde que esteja logado.
CREATE POLICY "Acesso total autenticado em cleaning_rooms" ON cleaning_rooms
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Acesso total autenticado em cleaning_assignments" ON cleaning_assignments
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Acesso total autenticado em shopping_items" ON shopping_items
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Acesso total autenticado em events" ON events
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Acesso total autenticado em notices" ON notices
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Acesso total autenticado em punishments" ON punishments
    FOR ALL TO authenticated USING (true);

-- ============================================================
-- 6. AUTOMAÇÃO E CRON (PG_CRON) - Apagar punições com + de 30 dias
-- ============================================================
-- A função delete_old_punishments realiza a deleção de registros antigos.
CREATE OR REPLACE FUNCTION delete_old_punishments() 
RETURNS void AS $$
BEGIN
  DELETE FROM punishments WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- O pg_cron é uma extensão disponível no Supabase para rodar jobs
-- Habilitar a extensão se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar para rodar todos os dias à meia noite
-- ATENÇÃO: Dependendo do seu plano no Supabase, pg_cron pode estar restrito.
-- Nesse caso, você pode chamar `delete_old_punishments()` via edge function/cron externo.
SELECT cron.schedule('delete-old-punishments', '0 0 * * *', 'SELECT delete_old_punishments()');

-- ============================================================
-- 7. DADOS INICIAIS (SEED)
-- ============================================================
-- Inserir os 10 cômodos fixos (9 cômodos + 1 descanso)
INSERT INTO cleaning_rooms (name, order_index) VALUES
('Cozinha', 1),
('Banheiro 1', 2),
('Banheiro 2', 3),
('Sala', 4),
('Corredores', 5),
('Área Externa', 6),
('Garagem', 7),
('Lavanderia', 8),
('Lixo', 9),
('Descanso', 10)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. SUPABASE STORAGE (BUCKETS)
-- ============================================================
-- IMPORTANTE: Rode essas instruções caso o upload de imagens de perfil
-- ou de vacilos não esteja funcionando no seu aplicativo.

-- Criar bucket para os avatares (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para as evidências (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidencias', 'evidencias', true) 
ON CONFLICT (id) DO NOTHING;

-- Permitir leitura pública dos avatares
CREATE POLICY "Avatares são públicos" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'avatars');

-- Permitir envio e atualização de avatares apenas para usuários logados
CREATE POLICY "Usuários autenticados podem enviar avatares" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Usuários autenticados podem atualizar avatares" ON storage.objects
FOR UPDATE TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Permitir leitura pública das evidências
CREATE POLICY "Evidências são públicas" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'evidencias');

-- Permitir envio de evidências apenas para usuários logados
CREATE POLICY "Usuários autenticados podem enviar evidências" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidencias');
