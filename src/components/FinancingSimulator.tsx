import React, { useState } from 'react';
import { Calculator, ArrowRight, ExternalLink, Building2, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface FinancingSimulatorProps {
  propertyPrice?: number;
  propertyTitle?: string;
  onOpenLeadModal?: () => void;
}

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({
  propertyPrice = 850000,
  propertyTitle,
  onOpenLeadModal
}) => {
  const { settings } = useSettings();
  const [price, setPrice] = useState<number>(propertyPrice || 850000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30); // 360 months
  const [interestRateYearly, setInterestRateYearly] = useState<number>(9.8);
  const [systemType, setSystemType] = useState<'SAC' | 'PRICE'>('SAC');

  const downPayment = (price * downPaymentPercent) / 100;
  const financedAmount = Math.max(0, price - downPayment);
  const totalMonths = termYears * 12;
  const monthlyRate = interestRateYearly / 100 / 12;

  // SAC Calculation:
  const monthlyAmortization = totalMonths > 0 ? financedAmount / totalMonths : 0;
  const sacFirstInstallment = monthlyAmortization + (financedAmount * monthlyRate);
  const sacLastInstallment = monthlyAmortization + (monthlyAmortization * monthlyRate);

  // PRICE Calculation:
  // P = financed * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const priceInstallment = totalMonths > 0 && monthlyRate > 0
    ? (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const currentFirstInstallment = systemType === 'SAC' ? sacFirstInstallment : priceInstallment;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappSimText = `Olá Sávio! Gostaria de consultar condições reais de financiamento imobiliário para o valor de ${formatBRL(price)}.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(directWhatsappSimText)}`;

  const officialBanks = [
    {
      id: 'caixa',
      bankName: 'Caixa Econômica Federal',
      officialUrl: 'https://simuladorhabitacao.caixa.gov.br/home',
      accentColor: '#005CA9',
      badge: 'Líder Habitacional',
      description: 'Principal agente de crédito habitacional do país, atuando no SFH, SFI e programas habitacionais governamentais.'
    },
    {
      id: 'itau',
      bankName: 'Itaú Crédito Imobiliário',
      officialUrl: 'https://www.itau.com.br/emprestimos-financiamentos/credito-imobiliario',
      accentColor: '#EC7000',
      badge: 'Taxas Competitivas',
      description: 'Linhas completas de financiamento habitacional com análise de crédito simplificada e opções pré ou pós-fixadas.'
    },
    {
      id: 'bb',
      bankName: 'Banco do Brasil',
      officialUrl: 'https://cim-simulador-imovelproprio.apps.bb.com.br/simulacao-imobiliario/posso-contratar',
      accentColor: '#003399',
      badge: 'Tradicional & Seguro',
      description: 'Simulação online de parcelas e carência com condições diferenciadas para correntistas e servidores.'
    },
    {
      id: 'bradesco',
      bankName: 'Bradesco Imóveis',
      officialUrl: 'https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm',
      accentColor: '#CC092F',
      badge: 'Financiamento Sob Medida',
      description: 'Crédito imobiliário inteligente com parcelamento sob medida e acompanhamento das etapas pelo app.'
    },
    {
      id: 'santander',
      bankName: 'Santander Financiamentos',
      officialUrl: 'https://www.negociosimobiliarios.santander.com.br/negociosimobiliarios/#/dados-pessoais',
      accentColor: '#CC0000',
      badge: 'Crédito Residencial',
      description: 'Simulação ágil e digital de crédito imobiliário residencial com prazos de amortização de até 35 anos.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* 1. INTERACTIVE CALCULATOR CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/90 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200/80 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0B2B20] text-[#C8A251] flex items-center justify-center shrink-0 shadow-md">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
                Simulação Financeira
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#0B2B20]">
                Simulador de Financiamento Habitacional
              </h3>
            </div>
          </div>

          {/* System Switcher: SAC vs PRICE */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start sm:self-auto border border-gray-200">
            <button
              type="button"
              onClick={() => setSystemType('SAC')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                systemType === 'SAC'
                  ? 'bg-[#0B2B20] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#0B2B20]'
              }`}
            >
              Tabela SAC (Decrescente)
            </button>
            <button
              type="button"
              onClick={() => setSystemType('PRICE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                systemType === 'PRICE'
                  ? 'bg-[#0B2B20] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#0B2B20]'
              }`}
            >
              Tabela PRICE (Fixa)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-gray-700">
                <span className="uppercase tracking-wider">Valor do Imóvel</span>
                <span className="text-[#0B2B20] font-bold font-editorial text-base">{formatBRL(price)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={15000000}
                step={50000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#0B2B20] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>R$ 200 mil</span>
                <span>R$ 15 milhões</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-gray-700">
                <span className="uppercase tracking-wider">Entrada ({downPaymentPercent}%)</span>
                <span className="text-[#0B2B20] font-bold text-sm">{formatBRL(downPayment)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#C8A251] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>10% (mínimo)</span>
                <span>70%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Prazo de Amortização
                </label>
                <select
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0B2B20]"
                >
                  <option value={15}>15 anos (180 meses)</option>
                  <option value={20}>20 anos (240 meses)</option>
                  <option value={25}>25 anos (300 meses)</option>
                  <option value={30}>30 anos (360 meses)</option>
                  <option value={35}>35 anos (420 meses)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Taxa de Juros Estimada (% a.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="6"
                  max="16"
                  value={interestRateYearly}
                  onChange={(e) => setInterestRateYearly(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B2B20] to-[#071C15] rounded-2xl p-6 sm:p-8 text-white text-center space-y-4 shadow-xl border border-[#1A4535]">
            <span className="text-[11px] uppercase tracking-widest text-[#C8A251] block font-semibold">
              {systemType === 'SAC' ? 'Primeira Parcela Estimada (SAC)' : 'Parcela Fixa Estimada (PRICE)'}
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-editorial text-white tracking-tight">
              {formatBRL(currentFirstInstallment)}
              <span className="text-xs text-gray-300 font-sans font-normal ml-1">/mês</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-white/10 text-gray-300">
              <div className="text-left">
                <span className="block text-gray-400 text-[11px]">Valor Financiado:</span>
                <strong className="text-white text-sm">{formatBRL(financedAmount)}</strong>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-[11px]">
                  {systemType === 'SAC' ? 'Última Parcela (Est.):' : 'Total de Parcelas:'}
                </span>
                <strong className="text-[#C8A251] text-sm">
                  {systemType === 'SAC' ? formatBRL(sacLastInstallment) : `${totalMonths} meses`}
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed text-center">
              *Valores informativos para planejamento prévio. As taxas reais, seguros e despesas cartorárias variam conforme o perfil cadastral junto à instituição financeira.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#C8A251] hover:bg-[#D4AF37] text-[#0B2B20] font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>Consultar Financiamento com Sávio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL BANK SIMULATORS ROW (TFT STYLE) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
            Simuladores Oficiais
          </span>
          <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B2B20]">
            Simulação Direta nas Instituições Financeiras
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Acesse os portais oficiais dos principais bancos do Brasil para obter sua carta de crédito aprovada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officialBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                    style={{ backgroundColor: `${bank.accentColor}15`, color: bank.accentColor }}
                  >
                    {bank.badge}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: bank.accentColor }}
                  />
                </div>

                <h5 className="font-editorial text-lg font-bold text-[#0B2B20] mb-2 group-hover:text-[#C8A251] transition-colors">
                  {bank.bankName}
                </h5>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-5">
                  {bank.description}
                </p>
              </div>

              <a
                href={bank.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold rounded-md border border-gray-200 text-[#0B2B20] hover:bg-[#0B2B20] hover:text-white hover:border-[#0B2B20] transition-all"
              >
                <span>Acessar Simulador Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
