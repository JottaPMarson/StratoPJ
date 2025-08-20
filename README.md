# 📊 StratoPJ - Sistema de Diagnóstico Financeiro

<div align="center">

![StratoPJ](https://img.shields.io/badge/StratoPJ-Sprint%20Acadêmico-ec0000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

**Sistema de Diagnóstico Financeiro e Análise de Redes para Pessoas Jurídicas**

*Sprint Acadêmico - Projeto de Dashboard Financeiro Inteligente*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Demo Live](#) • [📖 Documentação](README-LOCAL.md) • [🐛 Reportar Bug](issues)

</div>

---

## 🎓 Sobre o Projeto

O **StratoPJ** é um projeto desenvolvido como **sprint acadêmico** para criar uma solução completa de diagnóstico financeiro empresarial. A plataforma combina análise de dados, visualizações interativas e inteligência artificial para fornecer insights financeiros estratégicos para pessoas jurídicas.

### 🎯 Objetivos Acadêmicos
- Aplicar conceitos de **desenvolvimento web moderno**
- Implementar **dashboard interativo** com métricas em tempo real
- Praticar **arquitetura de software** escalável
- Desenvolver **UX/UI** focada em dados financeiros
- Integrar **bibliotecas modernas** do ecossistema React

---

## ✨ Funcionalidades Principais

### 📊 **Dashboard Financeiro**
- Métricas KPI em tempo real (Receita, ROI, Fluxo de Caixa)
- Gráficos interativos com Recharts
- Classificação automática do estágio empresarial
- Sistema de alertas e notificações

### 🔍 **Análises Avançadas**
- **Análise de Redes**: Visualização de relacionamentos financeiros
- **Análise Comparativa**: Benchmarking setorial
- **Tendências Temporais**: Identificação de padrões
- **Histórico de Diagnósticos**: Evolução da empresa

### 🎮 **Simulador de Cenários**
- Projeções financeiras dinâmicas
- Análise de sensibilidade
- Simulação de investimentos
- Otimização de recursos

### 📈 **Relatórios Inteligentes**
- Relatórios personalizáveis
- Exportação em múltiplos formatos
- Insights automatizados
- Recomendações estratégicas

### 📱 **Interface Moderna**
- Design system baseado em shadcn/ui
- Responsivo para todos os dispositivos
- Tema claro/escuro
- Animações suaves com Framer Motion

---

## 🛠️ Stack Tecnológica

### **Frontend**
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 15.2.4 | Framework React com App Router |
| **React** | 19 | Biblioteca de interface |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.4.17 | Framework CSS utilitário |

### **UI/UX**
| Biblioteca | Uso |
|------------|-----|
| **shadcn/ui** | Componentes base |
| **Radix UI** | Primitivos acessíveis |
| **Lucide React** | Ícones |
| **Framer Motion** | Animações |
| **Recharts** | Gráficos e visualizações |

### **Desenvolvimento**
| Ferramenta | Função |
|------------|---------|
| **pnpm** | Gerenciador de pacotes |
| **ESLint** | Linting de código |
| **Zod** | Validação de schemas |
| **date-fns** | Manipulação de datas |

---

## 🚀 Como Executar

### **Início Rápido**

#### Windows
```cmd
.\run-local.bat
```

#### macOS/Linux
```bash
./run-local.sh
```

### **Instalação Manual**

1. **Clone o repositório**
```bash
git clone https://github.com/lrafasouza/sprint.git
cd sprint
```

2. **Instale as dependências**
```bash
npm install -g pnpm
pnpm install
```

3. **Execute o projeto**
```bash
pnpm dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

### **Credenciais de Teste**
- **Email**: `admin@stratopj.com`
- **Senha**: `123456`

> 📝 **Nota**: Sistema com autenticação simulada para demonstração

---

## 📁 Estrutura do Projeto

```
sprint/
├── 📁 app/                    # App Router (Next.js 15)
│   ├── (auth)/               # Rotas de autenticação
│   │   └── login/            # Página de login
│   └── (dashboard)/          # Rotas do dashboard
│       ├── dashboard/        # Dashboard principal
│       ├── analises/         # Análises financeiras
│       │   └── rede/         # Análise de redes
│       ├── simulador/        # Simulador de cenários
│       ├── relatorios/       # Relatórios
│       └── configuracoes/    # Configurações
├── 📁 components/            # Componentes React
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── header.tsx            # Cabeçalho da aplicação
│   ├── sidebar.tsx           # Menu lateral
│   └── *.tsx                 # Componentes específicos
├── 📁 lib/                   # Utilitários e configurações
└── 📁 public/                # Assets estáticos
```

---

## 🎨 Screenshots

### Dashboard Principal
> 📊 Visão geral das métricas financeiras com gráficos interativos

### Análise de Redes
> 🔍 Visualização de relacionamentos e fluxos financeiros

### Simulador de Cenários
> 🎮 Interface para simulação de diferentes cenários financeiros

---

## 🎓 Conceitos Aplicados

### **Desenvolvimento Web**
- ✅ **App Router** (Next.js 15)
- ✅ **Server Components** e **Client Components**
- ✅ **TypeScript** para type safety
- ✅ **Responsive Design**
- ✅ **Performance Optimization**

### **UI/UX Design**
- ✅ **Design System** consistente
- ✅ **Acessibilidade** (a11y)
- ✅ **Dark/Light Mode**
- ✅ **Micro-interactions**
- ✅ **Data Visualization**

### **Arquitetura**
- ✅ **Component-Based Architecture**
- ✅ **Custom Hooks**
- ✅ **State Management**
- ✅ **Code Splitting**
- ✅ **Error Boundaries**

---

## 📊 Funcionalidades por Página

| Página | Funcionalidades |
|--------|----------------|
| **Dashboard** | KPIs, gráficos, classificação empresarial, alertas |
| **Análises** | Comparativas, redes, tendências, histórico |
| **Simulador** | Cenários, projeções, otimizações |
| **Relatórios** | Geração, filtros, exportação |
| **Classificação** | Estágio da empresa, recomendações |
| **Configurações** | Perfil, preferências, integrações |

---

## 🤝 Desenvolvimento Acadêmico

### **Aprendizados Principais**
- Implementação de dashboards complexos com React
- Integração de bibliotecas de visualização de dados
- Arquitetura escalável com Next.js App Router
- Design responsivo com Tailwind CSS
- Gerenciamento de estado em aplicações React

### **Desafios Superados**
- Renderização de gráficos interativos
- Performance em dashboards com muitos dados
- TypeScript em projetos complexos
- Sistema de roteamento avançado
- Integração de múltiplas bibliotecas UI

### **Técnicas Avançadas**
- Server-side rendering com Next.js
- Component composition patterns
- Custom hooks para lógica reutilizável
- Error boundaries para tratamento de erros
- Code splitting para otimização

---

## 📚 Documentação Adicional

- 📖 **[Guia de Execução Local](README-LOCAL.md)** - Instruções detalhadas
- 🔧 **[Scripts de Desenvolvimento](scripts/)** - Utilitários
- 🎨 **[Guia de Estilo](docs/style-guide.md)** - Padrões de design
- 🏗️ **[Arquitetura](docs/architecture.md)** - Estrutura técnica

---

## 🎯 Próximos Passos

### **Melhorias Planejadas**
- [ ] Integração com APIs reais de dados financeiros
- [ ] Sistema de autenticação completo
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] PWA (Progressive Web App)
- [ ] Modo offline para visualizações

### **Novas Funcionalidades**
- [ ] Chatbot com IA para insights
- [ ] Exportação avançada de relatórios
- [ ] Integração com bancos (Open Banking)
- [ ] Alertas por email/SMS
- [ ] Dashboard mobile nativo

---

## 👥 Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### **Reportar Problemas**
- Use as [Issues](issues) para reportar bugs
- Inclua screenshots quando possível
- Descreva os passos para reproduzir

---

<div align="center">

## 🎓 Projeto Acadêmico

**Desenvolvido como sprint de aprendizado**

*Aplicando conceitos modernos de desenvolvimento web*

---

[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green.svg)](LICENSE)
[![Status do Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](README.md)
[![Versão](https://img.shields.io/badge/Versão-1.0.0-blue.svg)](package.json)

**⭐ Se este projeto ajudou você, considere dar uma estrela!**

</div>
