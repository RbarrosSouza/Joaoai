import React from 'react';

type BrandLockupProps = {
    compact?: boolean;
    className?: string;
};

const BrandLockup: React.FC<BrandLockupProps> = ({ compact = false, className = '' }) => (
    <div className={`flex items-center ${compact ? 'gap-2.5' : 'gap-3'} ${className}`}>
        <img
            src="/brand/joao-symbol.png"
            alt=""
            aria-hidden="true"
            className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} shrink-0 object-contain`}
        />
        <div className="flex min-w-0 flex-col">
            <span className={`${compact ? 'text-[1.05rem]' : 'text-xl'} font-display font-bold leading-none tracking-[-0.055em] text-white`}>
                João<span className="text-brand-lime">.ai</span>
            </span>
            {!compact && (
                <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.25em] text-white/45 sm:block">
                    Suas finanças, em uma conversa
                </span>
            )}
        </div>
    </div>
);

export default BrandLockup;
