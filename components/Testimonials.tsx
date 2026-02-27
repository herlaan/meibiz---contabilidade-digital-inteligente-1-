import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Carlos Mendes",
      role: "Designer Gráfico",
      image: "https://picsum.photos/seed/person1/100/100",
      text: "Eu gastava horas todo mês com burocracia. Com a MeiBiz, resolvo tudo em 5 minutos pelo celular. O suporte é incrível!",
    },
    {
      name: "Ana Clara",
      role: "Arquiteta",
      image: "https://picsum.photos/seed/person2/100/100",
      text: "A migração da minha contabilidade antiga para a MeiBiz foi super tranquila. Economizei mais de R$ 200 por mês.",
    },
    {
      name: "Rafael Torres",
      role: "Desenvolvedor PJ",
      image: "https://picsum.photos/seed/person3/100/100",
      text: "A plataforma é muito intuitiva. Consigo emitir notas fiscais e pagar meu DAS sem dor de cabeça. Recomendo muito.",
    }
  ];

  return (
    <section className="py-20 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">O que dizem nossos clientes</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};