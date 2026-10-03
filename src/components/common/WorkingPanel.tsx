import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface WorkingStep {
  title: string;
  formula: string;
  calculation: string;
  result: string;
}

interface WorkingPanelProps {
  steps: WorkingStep[];
  defaultOpen?: boolean;
}

export const WorkingPanel: React.FC<WorkingPanelProps> = ({ steps, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-6 border-3 border-black bg-amber-50 dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-yellow-300 dark:bg-yellow-500 text-black flex items-center justify-between font-black text-left uppercase tracking-wider text-sm border-b-3 border-black transition-colors hover:bg-yellow-400"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-black" />
          <span>Show Full Working & Derivations ({steps.length} Steps)</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 font-mono text-sm">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-white dark:bg-zinc-800 border-2 border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#facc15]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs uppercase px-2 py-0.5 bg-black text-white dark:bg-yellow-400 dark:text-black">
                  Step {idx + 1}: {step.title}
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {step.result}
                </span>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Formula: </span>
                <code>{step.formula}</code>
              </div>
              <div className="text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-950 p-2 border border-black/40">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Working: </span>
                <span>{step.calculation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
