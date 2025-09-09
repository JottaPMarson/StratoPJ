// lib/types.ts - Tipos TypeScript baseados nos CSVs do Challenge FIAP

// Base 1 - Dados das empresas
export interface Empresa {
  ID: string;           // Número do Registro do cliente (CNPJ anonimizado)
  VL_FATU: number;      // Valor do Faturamento anual
  VL_SLDO: number;      // Valor do Saldo em Conta corrente
  DT_ABRT: string;      // Data de abertura da empresa
  DS_CNAE: string;      // Descrição do CNAE
  DT_REFE: string;      // Data de referência da Base
}

// Base 2 - Transações entre empresas
export interface Transacao {
  ID_PGTO: string;      // ID do cliente que enviou o valor
  ID_RCBE: string;      // ID do cliente que recebeu o valor
  VL: number;           // Valor transacionado
  DS_TRAN: string;      // Descrição da transação (PIX, TED, BOLETO, SISTEMICO)
  DT_REFE: string;      // Data de referência da transação
}

// Tipos de transação
export type TipoTransacao = 'PIX' | 'TED' | 'BOLETO' | 'SISTEMICO';

// Dados processados para o dashboard
export interface DadosFinanceiros {
  empresa: string;
  cnpj: string;
  data: string;
  receita: number;
  despesas: number;
  lucro: number;
  patrimonio: number;
  fluxoCaixa: number;
  classificacao: string;
  setor: string;
  cidade: string;
  estado: string;
}

// Métricas do dashboard
export interface MetricasDashboard {
  receitaTotal: number;
  lucroTotal: number;
  despesasTotal: number;
  totalEmpresas: number;
  margemLucro: number;
  dados: DadosFinanceiros[];
}

// Dados para análise de rede financeira
export interface RedeFinanceira {
  empresas: Empresa[];
  transacoes: Transacao[];
  metricas: {
    totalTransacoes: number;
    valorTotalTransacionado: number;
    empresasAtivas: number;
    tiposTransacao: Record<TipoTransacao, number>;
  };
}

// Dados para análise de tendências
export interface Tendencia {
  periodo: string;
  receita: number;
  despesas: number;
  lucro: number;
  transacoes: number;
}

// Dados para classificação de empresas
export interface ClassificacaoEmpresa {
  id: string;
  nome: string;
  setor: string;
  faturamento: number;
  saldo: number;
  classificacao: 'A' | 'B' | 'C' | 'D';
  risco: 'Baixo' | 'Médio' | 'Alto';
  score: number;
}

// Dados para relatórios
export interface Relatorio {
  titulo: string;
  periodo: string;
  resumo: {
    totalEmpresas: number;
    receitaTotal: number;
    despesasTotal: number;
    lucroTotal: number;
  };
  detalhes: DadosFinanceiros[];
  graficos: {
    tipo: 'bar' | 'line' | 'pie';
    dados: any[];
  }[];
}
