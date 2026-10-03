import React from 'react';
import { clsx } from 'clsx';

interface ResultCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  variant?: 'yellow' | 'cyan' | 'lime' | 'pink' | 'white';
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  subtext,
  badge,
  variant = 'white',
  className,
}) => {
  const variantStyles = {
    yellow: 'bg-amber-300 dark:bg-amber-400 text-black',
    cyan: 'bg-cyan-300 dark:bg-cyan-400 text-black',
    lime: 'bg-lime-300 dark:bg-lime-400 text-black',
    pink: 'bg-pink-300 dark:bg-pink-400 text-black',
    white: 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
  };

  return (
    <div
      className={clsx(
        'p-4 border-3 border-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15] flex flex-col justify-between relative',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-bold text-xs uppercase tracking-wider opacity-80">{label}</span>
        {badge && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-black bg-black text-white dark:bg-zinc-900 dark:text-white">
            {badge}
          </span>
        )}
      </div>
      <div>
        <div className="font-mono font-black text-2xl lg:text-3xl tracking-tight break-words">
          {value}
        </div>
        {subtext && (
          <div className="mt-1 font-mono text-xs opacity-85 leading-tight">{subtext}</div>
        )}
      </div>
    </div>
  );
};
