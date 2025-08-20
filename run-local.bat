@echo off
cls
echo ========================================
echo    STRATOPJ - Setup e Execucao Local
echo ========================================
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado! 
    echo 📥 Baixe e instale Node.js 18+ em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar versao do Node.js
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado

REM Verificar se pnpm esta instalado
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  pnpm nao encontrado. Instalando...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Falha ao instalar pnpm
        pause
        exit /b 1
    )
    echo ✅ pnpm instalado com sucesso
) else (
    for /f "tokens=1" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo ✅ pnpm %PNPM_VERSION% detectado
)

echo.
echo 📦 Instalando dependencias...
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Falha ao instalar dependencias
    echo 🔄 Tentando limpar cache e reinstalar...
    pnpm store prune
    del /q pnpm-lock.yaml 2>nul
    pnpm install
    if %errorlevel% neq 0 (
        echo ❌ Falha persistente. Verifique sua conexao e tente novamente
        pause
        exit /b 1
    )
)

echo ✅ Dependencias instaladas com sucesso
echo.

REM Verificar se eh a primeira execucao
if not exist ".env.local" (
    echo 🔧 Criando arquivo de configuracao .env.local...
    (
        echo # Configuracoes do StratoPJ
        echo NEXT_PUBLIC_APP_NAME=StratoPJ
        echo NEXT_PUBLIC_APP_VERSION=1.0.0
        echo NEXT_PUBLIC_ENVIRONMENT=development
        echo.
        echo # URLs da aplicacao
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
        echo.
        echo # Configuracoes de desenvolvimento
        echo NODE_ENV=development
        echo.
        echo # Chave secreta para sessoes (desenvolvimento)
        echo NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production
        echo.
        echo # Configuracoes opcionais
        echo NEXT_PUBLIC_DEBUG=true
    ) > .env.local
    echo ✅ Arquivo .env.local criado
)

echo.
echo 🔍 Verificando configuracao do projeto...

REM Verificar se TypeScript esta configurado
if not exist "tsconfig.json" (
    echo ❌ tsconfig.json nao encontrado!
    pause
    exit /b 1
)

REM Verificar se Next.js esta configurado
if not exist "next.config.mjs" (
    echo ❌ next.config.mjs nao encontrado!
    pause
    exit /b 1
)

echo ✅ Configuracoes verificadas
echo.

echo 🎨 Verificando componentes UI...
if not exist "components/ui" (
    echo ⚠️  Pasta components/ui nao encontrada
) else (
    echo ✅ Componentes UI encontrados
)

echo.
echo ========================================
echo    🚀 INICIANDO STRATOPJ
echo ========================================
echo.
echo 📍 URL: http://localhost:3000
echo 🔐 Login: Qualquer email valido (simulado)
echo 🔑 Senha: Qualquer senha com 6+ caracteres
echo.
echo ⚠️  Para parar o servidor: Ctrl+C
echo.

REM Aguardar um momento antes de iniciar
timeout /t 2 /nobreak >nul

REM Iniciar o servidor de desenvolvimento
echo 🌟 Iniciando servidor de desenvolvimento...
pnpm dev

REM Se chegou aqui, o servidor foi interrompido
echo.
echo ========================================
echo    📊 STRATOPJ FINALIZADO
echo ========================================
echo.
echo ✅ Servidor finalizado com sucesso
echo 🔄 Execute este script novamente para reiniciar
echo.
pause
