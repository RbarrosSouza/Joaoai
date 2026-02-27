import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Building2, Users } from 'lucide-react';

const UseCases: React.FC = () => {

    const cases = [
        {
            icon: <Stethoscope size={32} strokeWidth={1.5} />,
            title: "Profissionais Autônomos",
            subtitle: "Foco no trabalho, não na planilha.",
            desc: "Médicos, dentistas, advogados. Você cuida dos seus clientes, o João cuida das suas contas. Separa pessoal de profissional automaticamente.",
            color: "from-blue-500 to-cyan-400"
        },
        {
            icon: <Building2 size={32} strokeWidth={1.5} />,
            title: "Empreendedores",
            subtitle: "PF e PJ sem confusão.",
            desc: "Usa o mesmo cartão pra tudo? Sem problema. Só avisa o João qual conta é da empresa e qual é pessoal. Ele separa tudo.",
            color: "from-brand-lime to-yellow-500"
        },
        {
            icon: <Users size={32} strokeWidth={1.5} />,
            title: "Casais e Famílias",
            subtitle: "Contas da casa em dia.",
            desc: "Adiciona o João no grupo da família. Qualquer um que gastar só manda uma mensagem. No fim do mês, o relatório sai certinho.",
            color: "from-brand-primary to-brand-secondary"
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-brand-darkBg text-white relative overflow-hidden">
            {/* Background Liquid Glass Effects */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-light tracking-tight max-w-2xl">
                        Feito pra quem vive <span className="font-display italic text-brand-lime pr-2">correndo.</span>
                    </h2>
                    <p className="text-lg text-slate-300 font-light max-w-sm">
                        Não importa sua profissão. Se você gasta dinheiro, o João organiza pra você.
                    </p>
                </div>

                {/* Asymmetrical Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {cases.map((c, i) => (
                        <motion.div
                            key={i}
                            className={`group relative ${i === 1 ? 'md:translate-y-12' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                        >
                            {/* Translucent Card overlay */}
                            <div className="absolute inset-0 bg-brand-glass backdrop-blur-md rounded-3xl border border-brand-glassBorder opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                            <div className="p-8">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.color} text-white flex flex-col justify-center items-center shadow-glass mb-8 transform group-hover:-translate-y-2 transition-transform duration-500`}>
                                    {c.icon}
                                </div>
                                <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-brand-lime transition-colors duration-300">{c.title}</h3>
                                <h4 className="text-sm font-medium text-brand-secondary uppercase tracking-widest mb-4 opacity-80">{c.subtitle}</h4>
                                <p className="text-slate-300 font-light leading-relaxed">
                                    {c.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
