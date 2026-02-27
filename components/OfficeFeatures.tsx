import React from 'react';
import { MessageSquare, UserCheck, Wallet, Heart, FileText, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const OfficeFeatures: React.FC = () => {
  const features = [
    {
        icon: <MessageSquare className="w-6 h-6 text-white" />,
        title: "Atendimento Flexível",
        desc: "WhatsApp, e-mail, telefone ou chat. Fale como preferir.",
        color: "bg-blue-500"
    },
    {
        icon: <UserCheck className="w-6 h-6 text-white" />,
        title: "Assessor Dedicado",
        desc: "Um especialista que conhece o seu negócio de perto.",
        color: "bg-indigo-500"
    },
    {
        icon: <Wallet className="w-6 h-6 text-white" />,
        title: "Conta PJ Grátis",
        desc: "Pix ilimitado e integração total com sua contabilidade.",
        color: "bg-emerald-500"
    },
    {
        icon: <Heart className="w-6 h-6 text-white" />,
        title: "Benefícios Extras",
        desc: "Planos de saúde, bem-estar e seguros para você.",
        color: "bg-rose-500"
    },
    {
        icon: <FileText className="w-6 h-6 text-white" />,
        title: "Controle Total",
        desc: "Alertas automáticos, cobrança online e parcelamento.",
        color: "bg-amber-500"
    },
    {
        icon: <FileText className="w-6 h-6 text-white" />,
        title: "Gestão Completa",
        desc: "Impostos, folha, pró-labore e relatórios gerenciais.",
        color: "bg-slate-900"
    }
  ];

  return (
    <section id="servicos" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 max-w-3xl mx-auto reveal">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4">
                Um escritório completo feito para você
            </h2>
            <p className="text-slate-500 text-lg">
                Reunimos tecnologia e atendimento humano para entregar tudo o que sua empresa precisa em um só lugar.
            </p>
        </div>

        {/* Mobile: Infinite Marquee */}
        <div className="lg:hidden relative w-full mb-12 -mx-4">
            {/* Gradients removed */}

            <div className="flex gap-4 animate-marquee pause-on-hover w-max px-4">
                {[...features, ...features].map((feature, idx) => (
                    <div 
                      key={`mob-${idx}`} 
                      className="bg-slate-50 border border-slate-100 p-6 rounded-2xl w-[280px] flex-shrink-0"
                    >
                        <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="reveal-scale bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-default"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                    <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>

        <div className="text-center reveal delay-500">
            <Button variant="outline" className="border-brand-200 text-brand-600 hover:bg-brand-50">
                Ver todos os planos <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>

      </div>
    </section>
  );
};