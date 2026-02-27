import React from 'react';
import { Calculator, FileCheck, Headset, Smartphone, Clock, ShieldCheck } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Calculator className="w-6 h-6 text-brand-600" />,
      title: "Cálculo de Impostos",
      description: "Calculamos todas as suas guias (DAS, GPS) automaticamente e disponibilizamos na plataforma."
    },
    {
      icon: <FileCheck className="w-6 h-6 text-brand-600" />,
      title: "Obrigações em Dia",
      description: "Entrega de declarações anuais e mensais garantida. Nunca mais pague multa por atraso."
    },
    {
      icon: <Headset className="w-6 h-6 text-brand-600" />,
      title: "Atendimento Humano",
      description: "Dúvidas? Fale com nossos contadores especialistas por chat, WhatsApp ou e-mail."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-brand-600" />,
      title: "Tudo pelo App",
      description: "Emita notas fiscais, pague impostos e acompanhe seu CNPJ pelo celular ou computador."
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-600" />,
      title: "Abertura Rápida",
      description: "Processo de abertura de CNPJ 100% online e gratuito para quem assina o plano anual."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: "Segurança Total",
      description: "Seus dados protegidos com criptografia de ponta e backups diários."
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Tudo o que sua empresa precisa para crescer
          </h2>
          <p className="text-lg text-slate-600">
            Simplificamos a burocracia para você focar no que realmente importa: o seu negócio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-colors">
                <div className="group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};