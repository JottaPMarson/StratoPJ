// lib/csv-service.ts - Serviço para processar dados dos CSVs
import Papa from 'papaparse';
import { Empresa, Transacao, RedeFinanceira, TipoTransacao, DadosFinanceiros, MetricasDashboard } from './types';

export class CsvService {
  private static empresas: Empresa[] = [];
  private static transacoes: Transacao[] = [];
  private static isLoaded = false;

  // Carrega todos os dados dos CSVs
  static async carregarDados(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Carregar Base 1 (Empresas)
      const empresasData = await this.carregarCsv<Empresa>('/base1.csv');
      this.empresas = empresasData.map(empresa => ({
        ...empresa,
        VL_FATU: Number(empresa.VL_FATU),
        VL_SLDO: Number(empresa.VL_SLDO)
      }));

      // Carregar Base 2 (Transações)
      const transacoesData = await this.carregarCsv<Transacao>('/base2.csv');
      this.transacoes = transacoesData.map(transacao => ({
        ...transacao,
        VL: Number(transacao.VL)
      }));

      this.isLoaded = true;
      console.log(`Dados carregados: ${this.empresas.length} empresas, ${this.transacoes.length} transações`);
    } catch (error) {
      console.error('Erro ao carregar dados CSV:', error);
      throw error;
    }
  }

  // Método genérico para carregar CSV
  private static async carregarCsv<T>(url: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      console.log(`Carregando CSV: ${url}`);
      Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
        complete: (results) => {
          console.log(`CSV carregado: ${url}`, {
            totalRows: results.data.length,
            errors: results.errors.length,
            firstRow: results.data[0]
          });
          if (results.errors.length > 0) {
            console.warn('Erros no parsing CSV:', results.errors);
          }
          resolve(results.data as T[]);
        },
        error: (error) => {
          console.error(`Erro ao carregar CSV ${url}:`, error);
          reject(error);
        }
      });
    });
  }

  // Obter todas as empresas
  static async obterEmpresas(): Promise<Empresa[]> {
    await this.carregarDados();
    return this.empresas;
  }

  // Obter todas as transações
  static async obterTransacoes(): Promise<Transacao[]> {
    await this.carregarDados();
    return this.transacoes;
  }

  // Obter empresa por ID
  static async obterEmpresaPorId(id: string): Promise<Empresa | undefined> {
    await this.carregarDados();
    return this.empresas.find(empresa => empresa.ID === id);
  }

  // Obter transações de uma empresa (como pagador ou recebedor)
  static async obterTransacoesEmpresa(id: string): Promise<Transacao[]> {
    await this.carregarDados();
    return this.transacoes.filter(
      transacao => transacao.ID_PGTO === id || transacao.ID_RCBE === id
    );
  }

  // Obter rede financeira completa
  static async obterRedeFinanceira(): Promise<RedeFinanceira> {
    await this.carregarDados();
    
    const tiposTransacao: Record<TipoTransacao, number> = {
      'PIX': 0,
      'TED': 0,
      'BOLETO': 0,
      'SISTEMICO': 0
    };

    let valorTotalTransacionado = 0;
    const empresasAtivas = new Set<string>();

    this.transacoes.forEach(transacao => {
      tiposTransacao[transacao.DS_TRAN as TipoTransacao]++;
      valorTotalTransacionado += transacao.VL;
      empresasAtivas.add(transacao.ID_PGTO);
      empresasAtivas.add(transacao.ID_RCBE);
    });

    return {
      empresas: this.empresas,
      transacoes: this.transacoes,
      metricas: {
        totalTransacoes: this.transacoes.length,
        valorTotalTransacionado,
        empresasAtivas: empresasAtivas.size,
        tiposTransacao
      }
    };
  }

  // Processar dados para o dashboard (converter para formato esperado)
  static async obterDadosDashboard(): Promise<MetricasDashboard> {
    await this.carregarDados();

    const dados: DadosFinanceiros[] = this.empresas.map(empresa => {
      // Usar dados reais das empresas com lógica mais realística
      const receita = empresa.VL_FATU; // Faturamento anual
      const patrimonio = empresa.VL_SLDO; // Saldo em conta corrente
      
      // Calcular despesas de forma mais realística
      // Assumir que despesas são 70-90% do faturamento (margem típica de empresas)
      const percentualDespesas = 0.7 + (Math.random() * 0.2); // Entre 70% e 90%
      const despesas = receita * percentualDespesas;
      
      // Lucro = Receita - Despesas
      const lucro = receita - despesas;
      const fluxoCaixa = patrimonio;

      // Classificação baseada no faturamento
      let classificacao = 'C';
      if (empresa.VL_FATU > 1000000) classificacao = 'A';
      else if (empresa.VL_FATU > 500000) classificacao = 'B';

      return {
        empresa: empresa.ID,
        cnpj: empresa.ID,
        data: empresa.DT_REFE,
        receita,
        despesas,
        lucro,
        patrimonio,
        fluxoCaixa,
        classificacao,
        setor: empresa.DS_CNAE,
        cidade: 'Não informado',
        estado: 'Não informado'
      };
    });

    const receitaTotal = dados.reduce((sum, d) => sum + d.receita, 0);
    const despesasTotal = dados.reduce((sum, d) => sum + d.despesas, 0);
    const lucroTotal = dados.reduce((sum, d) => sum + d.lucro, 0);
    const margemLucro = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;

    console.log('Métricas calculadas:', {
      receitaTotal: receitaTotal.toLocaleString('pt-BR'),
      despesasTotal: despesasTotal.toLocaleString('pt-BR'),
      lucroTotal: lucroTotal.toLocaleString('pt-BR'),
      margemLucro: margemLucro.toFixed(2) + '%',
      totalEmpresas: dados.length
    });

    return {
      receitaTotal,
      lucroTotal,
      despesasTotal,
      totalEmpresas: dados.length,
      margemLucro,
      dados
    };
  }

  // Obter métricas por setor
  static async obterMetricasPorSetor(): Promise<Record<string, any>> {
    await this.carregarDados();
    
    const setores: Record<string, any> = {};
    
    this.empresas.forEach(empresa => {
      const setor = empresa.DS_CNAE;
      if (!setores[setor]) {
        setores[setor] = {
          totalEmpresas: 0,
          faturamentoTotal: 0,
          saldoTotal: 0,
          empresas: []
        };
      }
      
      setores[setor].totalEmpresas++;
      setores[setor].faturamentoTotal += empresa.VL_FATU;
      setores[setor].saldoTotal += empresa.VL_SLDO;
      setores[setor].empresas.push(empresa);
    });

    return setores;
  }

  // Obter tendências por período
  static async obterTendencias(): Promise<any[]> {
    await this.carregarDados();
    
    const periodos: Record<string, any> = {};
    
    // Agrupar transações por mês
    this.transacoes.forEach(transacao => {
      const mes = transacao.DT_REFE.substring(0, 7); // YYYY-MM
      if (!periodos[mes]) {
        periodos[mes] = {
          periodo: mes,
          receita: 0,
          despesas: 0,
          transacoes: 0
        };
      }
      
      periodos[mes].transacoes++;
      // Aqui você pode implementar lógica mais complexa para calcular receitas/despesas
    });

    return Object.values(periodos).sort((a: any, b: any) => a.periodo.localeCompare(b.periodo));
  }

  // Obter distribuição de receitas por tipo de transação
  static obterReceitasPorTipoTransacao(): { name: string; value: number; percentage: number }[] {
    if (!this.isLoaded || this.transacoes.length === 0) {
      return [
        { name: "PIX", value: 0, percentage: 0 },
        { name: "TED", value: 0, percentage: 0 },
        { name: "BOLETO", value: 0, percentage: 0 },
        { name: "SISTEMICO", value: 0, percentage: 0 }
      ];
    }

    // Agrupar transações por tipo
    const transacoesPorTipo = this.transacoes.reduce((acc, transacao) => {
      const tipo = transacao.DS_TRAN;
      if (!acc[tipo]) {
        acc[tipo] = { count: 0, total: 0 };
      }
      acc[tipo].count++;
      acc[tipo].total += transacao.VL;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    // Calcular total geral
    const totalGeral = Object.values(transacoesPorTipo).reduce((sum, item) => sum + item.total, 0);

    // Converter para array com percentuais
    return Object.entries(transacoesPorTipo).map(([tipo, dados]) => ({
      name: tipo,
      value: Math.round(dados.total),
      percentage: totalGeral > 0 ? Math.round((dados.total / totalGeral) * 100) : 0
    }));
  }


  // Limpar cache (útil para desenvolvimento)
  static limparCache(): void {
    this.empresas = [];
    this.transacoes = [];
    this.isLoaded = false;
  }
}
