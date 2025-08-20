#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}========================================"
echo -e "   STRATOPJ - Setup e Execução Local"
echo -e "========================================${NC}"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo -e "${BLUE}📥 Baixe e instale Node.js 18+ em: https://nodejs.org${NC}"
    echo ""
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} detectado${NC}"

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao instalar pnpm${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ pnpm instalado com sucesso${NC}"
else
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✅ pnpm ${PNPM_VERSION} detectado${NC}"
fi

echo ""
echo -e "${BLUE}📦 Instalando dependências...${NC}"
pnpm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha ao instalar dependências${NC}"
    echo -e "${YELLOW}🔄 Tentando limpar cache e reinstalar...${NC}"
    pnpm store prune
    rm -f pnpm-lock.yaml
    pnpm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha persistente. Verifique sua conexão e tente novamente${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Dependências instaladas com sucesso${NC}"
echo ""

# Verificar se é a primeira execução
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}🔧 Criando arquivo de configuração .env.local...${NC}"
    cat > .env.local << EOL
# Configurações do StratoPJ
NEXT_PUBLIC_APP_NAME=StratoPJ
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# URLs da aplicação
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configurações de desenvolvimento
NODE_ENV=development

# Chave secreta para sessões (desenvolvimento)
NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production

# Configurações opcionais
NEXT_PUBLIC_DEBUG=true
EOL
    echo -e "${GREEN}✅ Arquivo .env.local criado${NC}"
fi

echo ""
echo -e "${BLUE}🔍 Verificando configuração do projeto...${NC}"

# Verificar se TypeScript está configurado
if [ ! -f "tsconfig.json" ]; then
    echo -e "${RED}❌ tsconfig.json não encontrado!${NC}"
    exit 1
fi

# Verificar se Next.js está configurado
if [ ! -f "next.config.mjs" ]; then
    echo -e "${RED}❌ next.config.mjs não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configurações verificadas${NC}"
echo ""

echo -e "${BLUE}🎨 Verificando componentes UI...${NC}"
if [ ! -d "components/ui" ]; then
    echo -e "${YELLOW}⚠️  Pasta components/ui não encontrada${NC}"
else
    echo -e "${GREEN}✅ Componentes UI encontrados${NC}"
fi

echo ""
echo -e "${CYAN}========================================"
echo -e "   🚀 INICIANDO STRATOPJ"
echo -e "========================================${NC}"
echo ""
echo -e "${BLUE}📍 URL: http://localhost:3000${NC}"
echo -e "${BLUE}🔐 Login: Qualquer email válido (simulado)${NC}"
echo -e "${BLUE}🔑 Senha: Qualquer senha com 6+ caracteres${NC}"
echo ""
echo -e "${YELLOW}⚠️  Para parar o servidor: Ctrl+C${NC}"
echo ""

# Aguardar um momento antes de iniciar
sleep 2

# Iniciar o servidor de desenvolvimento
echo -e "${PURPLE}🌟 Iniciando servidor de desenvolvimento...${NC}"
pnpm dev

# Se chegou aqui, o servidor foi interrompido
echo ""
echo -e "${CYAN}========================================"
echo -e "   📊 STRATOPJ FINALIZADO"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}✅ Servidor finalizado com sucesso${NC}"
echo -e "${BLUE}🔄 Execute este script novamente para reiniciar${NC}"
echo ""
