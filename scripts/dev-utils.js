#!/usr/bin/env node

/**
 * StratoPJ Development Utilities
 * Utilitários para desenvolvimento local
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}🎯 ${msg}${colors.reset}`)
};

/**
 * Verificar se o projeto está funcionando corretamente
 */
function healthCheck() {
  log.title('STRATOPJ HEALTH CHECK');
  console.log('');

  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log.success(`Node.js ${nodeVersion}`);
  } catch (error) {
    log.error('Node.js não encontrado');
    return false;
  }

  // Verificar pnpm
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    log.success(`pnpm ${pnpmVersion}`);
  } catch (error) {
    log.warning('pnpm não encontrado, usando npm como fallback');
  }

  // Verificar arquivos essenciais
  const essentialFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'tailwind.config.ts',
    'app/layout.tsx'
  ];

  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log.success(`${file} encontrado`);
    } else {
      log.error(`${file} não encontrado`);
      return false;
    }
  });

  // Verificar dependências
  if (fs.existsSync('node_modules')) {
    log.success('node_modules presente');
  } else {
    log.warning('node_modules não encontrado - execute: pnpm install');
  }

  // Verificar .env.local
  if (fs.existsSync('.env.local')) {
    log.success('.env.local configurado');
  } else {
    log.warning('.env.local não encontrado - será criado automaticamente');
  }

  console.log('');
  log.success('Health check concluído!');
  return true;
}

/**
 * Limpar cache e arquivos temporários
 */
function cleanProject() {
  log.title('LIMPANDO PROJETO');
  console.log('');

  const dirsToClean = ['.next', 'node_modules/.cache', 'dist'];
  const filesToClean = ['.next', 'tsconfig.tsbuildinfo'];

  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
        log.success(`${dir} removido`);
      } catch (error) {
        // Fallback para Windows
        try {
          execSync(`rmdir /s /q ${dir}`, { stdio: 'inherit' });
          log.success(`${dir} removido`);
        } catch (winError) {
          log.warning(`Não foi possível remover ${dir}`);
        }
      }
    }
  });

  filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        log.success(`${file} removido`);
      } catch (error) {
        log.warning(`Não foi possível remover ${file}`);
      }
    }
  });

  console.log('');
  log.success('Limpeza concluída!');
}

/**
 * Verificar e instalar dependências
 */
function installDependencies() {
  log.title('INSTALANDO DEPENDÊNCIAS');
  console.log('');

  try {
    // Tentar pnpm primeiro
    execSync('pnpm --version', { stdio: 'pipe' });
    log.info('Usando pnpm...');
    execSync('pnpm install', { stdio: 'inherit' });
  } catch (error) {
    // Fallback para npm
    log.info('Usando npm...');
    execSync('npm install', { stdio: 'inherit' });
  }

  log.success('Dependências instaladas!');
}

/**
 * Criar arquivo .env.local se não existir
 */
function createEnvFile() {
  if (!fs.existsSync('.env.local')) {
    log.info('Criando .env.local...');
    
    const envContent = `# Configurações do StratoPJ
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
`;

    fs.writeFileSync('.env.local', envContent);
    log.success('.env.local criado!');
  } else {
    log.info('.env.local já existe');
  }
}

/**
 * Iniciar servidor de desenvolvimento com verificações
 */
function startDev() {
  log.title('INICIANDO STRATOPJ');
  console.log('');

  // Verificações pré-inicialização
  createEnvFile();

  if (!fs.existsSync('node_modules')) {
    log.warning('Dependências não encontradas, instalando...');
    installDependencies();
  }

  // Verificar porta 3000
  const port = process.env.PORT || 3000;
  
  log.info(`Iniciando servidor na porta ${port}...`);
  log.info('URL: http://localhost:' + port);
  log.info('Para parar o servidor: Ctrl+C');
  console.log('');

  try {
    // Tentar pnpm primeiro
    execSync('pnpm --version', { stdio: 'pipe' });
    execSync('pnpm dev', { stdio: 'inherit' });
  } catch (error) {
    // Fallback para npm
    execSync('npm run dev', { stdio: 'inherit' });
  }
}

/**
 * Exibir informações do projeto
 */
function showInfo() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  log.title('INFORMAÇÕES DO PROJETO');
  console.log('');
  console.log(`${colors.bright}Nome:${colors.reset} ${packageJson.name}`);
  console.log(`${colors.bright}Versão:${colors.reset} ${packageJson.version}`);
  console.log(`${colors.bright}Next.js:${colors.reset} ${packageJson.dependencies.next}`);
  console.log(`${colors.bright}React:${colors.reset} ${packageJson.dependencies.react}`);
  console.log(`${colors.bright}TypeScript:${colors.reset} ${packageJson.devDependencies.typescript}`);
  console.log('');

  // Scripts disponíveis
  console.log(`${colors.bright}Scripts disponíveis:${colors.reset}`);
  Object.entries(packageJson.scripts).forEach(([script, command]) => {
    console.log(`  ${colors.cyan}pnpm ${script}${colors.reset} - ${command}`);
  });
  console.log('');
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'check':
  case 'health':
    healthCheck();
    break;
  case 'clean':
    cleanProject();
    break;
  case 'install':
    installDependencies();
    break;
  case 'start':
  case 'dev':
    startDev();
    break;
  case 'info':
    showInfo();
    break;
  default:
    log.title('STRATOPJ DEV UTILS');
    console.log('');
    console.log('Comandos disponíveis:');
    console.log(`  ${colors.cyan}node scripts/dev-utils.js check${colors.reset}    - Verificar saúde do projeto`);
    console.log(`  ${colors.cyan}node scripts/dev-utils.js clean${colors.reset}    - Limpar cache e arquivos temporários`);
    console.log(`  ${colors.cyan}node scripts/dev-utils.js install${colors.reset}  - Instalar dependências`);
    console.log(`  ${colors.cyan}node scripts/dev-utils.js start${colors.reset}    - Iniciar servidor de desenvolvimento`);
    console.log(`  ${colors.cyan}node scripts/dev-utils.js info${colors.reset}     - Mostrar informações do projeto`);
    console.log('');
    console.log('Exemplos:');
    console.log(`  ${colors.yellow}node scripts/dev-utils.js check${colors.reset}`);
    console.log(`  ${colors.yellow}node scripts/dev-utils.js start${colors.reset}`);
    console.log('');
}
