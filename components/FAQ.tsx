import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "O que é contabilidade online?",
      answer: "É a evolução do escritório tradicional. Você envia e recebe documentos pela nossa plataforma digital, tem acesso a relatórios em tempo real e conta com atendimento de contadores especializados via chat, e-mail ou WhatsApp, pagando muito menos."
    },
    {
      question: "Para quem é indicada a MeiBiz?",
      answer: "Atendemos empresas de serviços e comércio, desde profissionais liberais, freelancers e PJ, até pequenas lojas e e-commerces. Atendemos MEI, ME e EPP no Simples Nacional e Lucro Presumido."
    },
    {
      question: "Quais são os valores?",
      answer: "Nossos planos começam a partir de R$ 109,00/mês para empresas de serviço. O valor varia conforme o tipo de atividade, faturamento e número de sócios/funcionários."
    },
    {
      question: "A abertura de empresa é grátis?",
      answer: "Sim! Para quem contrata o plano anual, não cobramos honorários de abertura. Você paga apenas as taxas governamentais obrigatórias."
    },
    {
      question: "São contadores reais?",
      answer: "Sim. Temos um time de contadores especialistas (CRC ativo) que cuidam da sua empresa e estão disponíveis para tirar dúvidas. A tecnologia agiliza o processo, mas a expertise é humana."
    },
     {
      question: "Quais segmentos vocês atendem?",
      answer: "Atendemos centenas de profissões: TI, Saúde, Marketing, Engenharia, Arquitetura, Comércio Varejista, entre outros. Consulte nosso time para verificar sua atividade específica."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[-100px] w-96 h-96 bg-brand-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-accent-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Sticky Header & CTA */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <span className="text-brand-600 font-bold uppercase tracking-wider text-sm mb-3 block">Tira-Dúvidas</span>
              <h2 className="text-3xl lg:text-4xl font-medium text-slate-900 mb-6 leading-tight">
                Perguntas Frequentes
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Separamos as principais dúvidas de quem está começando ou migrando de contabilidade.
              </p>

              {/* Support Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <MessageCircle size={24} />
                </div>
                <h3 className="font-medium text-slate-900 mb-2">Ainda tem dúvidas?</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Nosso time de especialistas está online agora para te ajudar.
                </p>
                <Button fullWidth className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20">
                   Chamar no WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-2xl transition-all duration-300 border ${
                  openIndex === index 
                    ? 'shadow-lg border-brand-100' 
                    : 'shadow-sm border-slate-100 hover:border-brand-200 hover:shadow-md'
                }`}
              >
                <button
                  className="w-full flex justify-between items-start p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-medium text-lg pr-8 transition-colors ${openIndex === index ? 'text-brand-600' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 mt-1 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                    {openIndex === index ? (
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                        <Minus size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Plus size={18} />
                      </div>
                    )}
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-500 leading-relaxed border-t border-dashed border-slate-100 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-8 flex justify-center lg:justify-start">
               <a href="#" className="inline-flex items-center font-medium text-brand-600 hover:text-brand-700 transition-colors group">
                  Ver Central de Ajuda completa <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};