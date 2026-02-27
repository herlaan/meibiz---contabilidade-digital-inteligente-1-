import React from 'react';

export const ServedCities: React.FC = () => {
  const regions = [
    { name: "Sudeste", cities: "São Paulo, Rio de Janeiro, Belo Horizonte, Vitória, Campinas, Santos..." },
    { name: "Sul", cities: "Curitiba, Florianópolis, Porto Alegre, Londrina, Joinville, Caxias do Sul..." },
    { name: "Nordeste", cities: "Salvador, Recife, Fortaleza, Natal, João Pessoa, Maceió, São Luís..." },
    { name: "Centro-Oeste", cities: "Brasília, Goiânia, Campo Grande, Cuiabá, Anápolis..." },
    { name: "Norte", cities: "Manaus, Belém, Palmas, Porto Velho, Macapá..." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-medium text-slate-900 mb-8">Atendemos em todo o Brasil</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {regions.map((region) => (
            <div key={region.name} className="relative group">
              <button className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-brand-600 hover:text-white hover:border-brand-600 font-medium text-slate-700 transition-all text-sm">
                {region.name}
              </button>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-slate-900 text-white text-xs p-4 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl pointer-events-none">
                <p className="font-medium mb-2 border-b border-slate-700 pb-2 text-brand-400">{region.name}</p>
                <p className="opacity-80 leading-relaxed">{region.cities}</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-slate-500 text-sm">Consulte a disponibilidade exata para o seu município no momento do cadastro.</p>
      </div>
    </section>
  );
};