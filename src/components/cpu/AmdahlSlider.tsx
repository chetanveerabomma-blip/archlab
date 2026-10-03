import React from 'react';
import { calculateAmdahlSpeedup } from '../../lib/cpu';

interface AmdahlSliderProps {
  parallelFraction: number;
  onChange: (val: number) => void;
  cpus: { name: string; cores: number }[];
}

export const AmdahlSlider: React.FC<AmdahlSliderProps> = ({
  parallelFraction,
  onChange,
  cpus,
}) => {
  return (
    <div className="p-5 border-3 border-black bg-white dark:bg-zinc-850 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Amdahl's Law Multicore Scaling Model
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-0.5">
            Formula: S(p, N) = 1 / ((1 - p) + p / N)
          </p>
        </div>
        <span className="font-mono font-black text-sm bg-amber-300 dark:bg-yellow-400 text-black px-2.5 py-1 border-2 border-black">
          Parallel Fraction (p): {Math.round(parallelFraction * 100)}%
        </span>
      </div>

      {/* Slider */}
      <div className="py-2">
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(parallelFraction * 100)}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 accent-black dark:accent-yellow-400 cursor-pointer border-2 border-black"
        />
        <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
          <span>0% (Strictly Serial)</span>
          <span>50% Parallel</span>
          <span>100% (Embarrassingly Parallel)</span>
        </div>
      </div>

      {/* Live Speedup Output Per CPU */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {cpus.map((c, idx) => {
          const speedup = calculateAmdahlSpeedup(parallelFraction, c.cores);
          return (
            <div
              key={idx}
              className="p-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs"
            >
              <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{c.name.split(' ')[0]}</div>
              <div className="text-[10px] text-zinc-500">{c.cores} Cores</div>
              <div className="text-xl font-black text-amber-600 dark:text-yellow-400 mt-1">
                {speedup}x
              </div>
              <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                Speedup over single core
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
