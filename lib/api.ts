// lib/api.ts - Serviço para consumir dados dos CSVs locais
import { CsvService } from './csv-service';
import { DadosFinanceiros, MetricasDashboard, Empresa, Transacao, RedeFinanceira } from './types';

export type { DadosFinanceiros, MetricasDashboard, Empresa, Transacao, RedeFinanceira };

export class ApiService {
  // Obter dados financeiros das empresas
  static async obterDados(): Promise<DadosFinanceiros[]> {
    try {
      const dashboard = await CsvService.obterDadosDashboard();
      return dashboard.dados;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return [];
    }
  }

  // Obter métricas gerais
  static async obterMetricas(): Promise<any> {
    try {
      const redeFinanceira = await CsvService.obterRedeFinanceira();
      const metricasPorSetor = await CsvService.obterMetricasPorSetor();
      
      return {
        redeFinanceira: redeFinanceira.metricas,
        setores: metricasPorSetor,
        totalEmpresas: redeFinanceira.empresas.length,
        totalTransacoes: redeFinanceira.transacoes.length
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return {};
    }
  }

  // Obter dados completos do dashboard
  static async obterDadosDashboard(): Promise<MetricasDashboard> {
    try {
      return await CsvService.obterDadosDashboard();
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return {
        receitaTotal: 0,
        lucroTotal: 0,
        despesasTotal: 0,
        totalEmpresas: 0,
        margemLucro: 0,
        dados: []
      };
    }
  }

  // Obter rede financeira completa
  static async obterRedeFinanceira(): Promise<RedeFinanceira> {
    try {
      return await CsvService.obterRedeFinanceira();
    } catch (error) {
      console.error('Erro ao buscar rede financeira:', error);
      return {
        empresas: [],
        transacoes: [],
        metricas: {
          totalTransacoes: 0,
          valorTotalTransacionado: 0,
          empresasAtivas: 0,
          tiposTransacao: {
            'PIX': 0,
            'TED': 0,
            'BOLETO': 0,
            'SISTEMICO': 0
          }
        }
      };
    }
  }

  // Obter empresa específica
  static async obterEmpresa(id: string): Promise<Empresa | undefined> {
    try {
      return await CsvService.obterEmpresaPorId(id);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      return undefined;
    }
  }

  // Obter transações de uma empresa
  static async obterTransacoesEmpresa(id: string): Promise<Transacao[]> {
    try {
      return await CsvService.obterTransacoesEmpresa(id);
    } catch (error) {
      console.error('Erro ao buscar transações da empresa:', error);
      return [];
    }
  }

  // Obter métricas por setor
  static async obterMetricasPorSetor(): Promise<Record<string, any>> {
    try {
      return await CsvService.obterMetricasPorSetor();
    } catch (error) {
      console.error('Erro ao buscar métricas por setor:', error);
      return {};
    }
  }

  // Obter tendências
  static async obterTendencias(): Promise<any[]> {
    try {
      return await CsvService.obterTendencias();
    } catch (error) {
      console.error('Erro ao buscar tendências:', error);
      return [];
    }
  }

  // Inicializar dados (carregar CSVs)
  static async inicializar(): Promise<void> {
    try {
      await CsvService.carregarDados();
      console.log('Dados CSV carregados com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      throw error;
    }
  }

  // Obter receitas por tipo de transação
  static async obterReceitasPorTipoTransacao(): Promise<{ name: string; value: number; percentage: number }[]> {
    return CsvService.obterReceitasPorTipoTransacao();
  }

}
