import React from 'react';
import { ArrowLeft, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface ProtectedServiceProps {
    onBack: () => void;
    title: string;
    subtitle: string;
    description?: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    ctaText: string;
    whatsappMessage: string;
}

export const ProtectedService: React.FC<ProtectedServiceProps> = ({
    onBack,
    title,
    subtitle,
    description,
    icon,
    children,
    ctaText,
    whatsappMessage
}) => {
    const handleWhatsAppClick = () => {
        const phone = "5575988927727";
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>

            <div className="max-w-4xl mx-auto relative z-10">

                <div className="reveal active">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                        {icon}
                        Área Exclusiva para Clientes
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-xl text-brand-400 font-medium mb-8">{subtitle}</p>

                    {description && (
                        <p className="text-slate-400 text-lg mb-8 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="max-w-3xl">
                        {children}
                    </div>

                    <div className="mt-16 text-center">
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-full px-8 py-4 text-lg shadow-xl shadow-brand-500/30 group w-full sm:w-auto"
                            onClick={handleWhatsAppClick}
                        >
                            <span className="mr-2">👉</span> {ctaText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
