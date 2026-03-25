-- Execute este código no SQL Editor do Supabase para preparar as tabelas necessárias para as novas funcionalidades corporativas do Dashboard

-- 0. Adiciona a coluna role para gerir Administradores (se ainda não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' 
        CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- 1. Criação da tabela de Solicitações (Pedidos de NF, Chamados de Suporte, etc)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('nf_emission', 'support_ticket', 'general_request')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS (Row Level Security) para a tabela
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Permitir que usuários leiam/escrevam apenas as suas solicitações)
DROP POLICY IF EXISTS "Usuários podem ver as suas próprias solicitações" ON public.service_requests;
CREATE POLICY "Usuários podem ver as suas próprias solicitações" 
ON public.service_requests FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar as suas solicitações" ON public.service_requests;
CREATE POLICY "Usuários podem criar as suas solicitações" 
ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Administradores podem ler/escrever tudo" ON public.service_requests;
CREATE POLICY "Administradores podem ler/escrever tudo"
ON public.service_requests 
FOR ALL 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin' )
WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin' );

-- 2. Atualização da tabela Profiles para suportar Status da DASN e Variáveis Dinâmicas
-- Adicionando as colunas caso não existam
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='dasn_status') THEN
        ALTER TABLE public.profiles ADD COLUMN dasn_status TEXT DEFAULT 'pending' 
        CHECK (dasn_status IN ('pending', 'analysis', 'transmitted'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='declared_revenue') THEN
        ALTER TABLE public.profiles ADD COLUMN declared_revenue NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='tax_savings') THEN
        ALTER TABLE public.profiles ADD COLUMN tax_savings NUMERIC;
    END IF;
END $$;

-- 3. Atualizar/Configurar o Bucket de Documentos com Segurança IDOR (Acesso Restrito)
-- Força que apenas o dono do UUID possa ler os seus ficheiros da pasta!
DROP POLICY IF EXISTS "Apenas dono acede aos ficheiros" ON storage.objects;
CREATE POLICY "Apenas dono acede aos ficheiros"
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'documentos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. MITIGAÇÃO CRÍTICA (Escalonamento de Privilégios/Mass Assignment)
-- Impede que utilizadores comuns burlem o RLS injetando 'role=admin' ou mudando o 'plan_type' via React
CREATE OR REPLACE FUNCTION public.protect_critical_columns()
RETURNS trigger AS $$
BEGIN
  -- Se quem está a fazer UPDATE for o front-end comum (anon/authenticated), congela estes campos
  IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
      NEW.role = OLD.role;
      NEW.plan_type = OLD.plan_type;
      NEW.dasn_status = OLD.dasn_status;
      NEW.tax_savings = OLD.tax_savings;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_critical_columns ON public.profiles;
CREATE TRIGGER trg_protect_critical_columns
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_critical_columns();
