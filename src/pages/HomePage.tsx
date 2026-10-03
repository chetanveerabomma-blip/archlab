import React from 'react';
import { NavLink } from 'react-router-dom';
import { HardDrive, Cpu, Wrench, ArrowRight, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="p-8 md:p-14 border-4 border-black bg-amber-300 dark:bg-yellow-400 text-black shadow-[8px_8px_0px_0px_#000] mb-14 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-block px-3 py-1 bg-black text-white font-mono font-bold text-xs uppercase mb-4 tracking-wider">
            ★ Next-Gen Computer Architecture Engineering Suite
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            Master Micro-architecture With Zero Guesswork.
          </h1>
          <p className="font-mono text-base md:text-lg font-medium leading-relaxed mb-8 max-w-2xl text-zinc-900">
            ArchLab is a precision toolkit of 3 interactive calculators designed for students, computer engineers, and hardware enthusiasts. Explore bus decoding, CPU throughput, Amdahl's Law, and bottleneck balances.
          </p>
          <div className="flex flex-wrap gap-4">
            <NavLink
              to="/memory"
              className="px-6 py-3.5 neo-btn bg-black text-white text-sm uppercase flex items-center gap-2"
            >
              <span>Explore Memory Calculator</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
            </NavLink>
            <NavLink
              to="/formulas"
              className="px-6 py-3.5 neo-btn bg-white text-black text-sm uppercase flex items-center gap-2"
            >
              <span>Formulas & Cheat Sheets</span>
            </NavLink>
          </div>
        </div>

        {/* Decorative architectural ASCII art watermark */}
        <div className="hidden lg:block absolute -right-6 -bottom-6 font-mono text-[9px] font-bold text-black/15 select-none leading-none pointer-events-none whitespace-pre">
{`
+---------------------------------------+
|  CPU CORE 0   |       L1 CACHE        |
+---------------------------------------+
|  BUS ARBITER  |  MEMORY CONTROLLER    |
+---------------------------------------+
|         DDR5 DUAL-CHANNEL BUS         |
+---------------------------------------+
`}
        </div>
      </div>

      {/* 3 Core Module Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Module 1 */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#facc15] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-amber-400 border-2 border-black flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_0px_#000]">
              <HardDrive className="w-6 h-6 text-black" />
            </div>
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-yellow-400 uppercase">
              Module 01
            </div>
            <h3 className="text-2xl font-black uppercase mt-1 mb-3 text-zinc-900 dark:text-zinc-100">
              Memory Address Calculator
            </h3>
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Compute address spaces ($2^n$), chip expansions (horizontal word widening & vertical depth banking), binary address partitioning, and hardware chip-select decoder requirements.
            </p>
          </div>
          <NavLink
            to="/memory"
            className="w-full py-2.5 neo-btn bg-yellow-300 hover:bg-yellow-400 text-black text-center text-xs uppercase font-bold flex items-center justify-center gap-1.5"
          >
            <span>Launch Memory Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {/* Module 2 */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#facc15] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-cyan-400 border-2 border-black flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Cpu className="w-6 h-6 text-black" />
            </div>
            <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
              Module 02
            </div>
            <h3 className="text-2xl font-black uppercase mt-1 mb-3 text-zinc-900 dark:text-zinc-100">
              CPU Spec Comparer
            </h3>
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Evaluate microprocessors side-by-side using the fundamental CPU performance equation (Time = Instructions × CPI / Frequency), instruction mix modeling, MIPS, Amdahl's Law, and multi-level AMAT cache hierarchies.
            </p>
          </div>
          <NavLink
            to="/cpu"
            className="w-full py-2.5 neo-btn bg-cyan-300 hover:bg-cyan-400 text-black text-center text-xs uppercase font-bold flex items-center justify-center gap-1.5"
          >
            <span>Launch CPU Comparer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {/* Module 3 */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#facc15] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-lime-400 border-2 border-black flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Wrench className="w-6 h-6 text-black" />
            </div>
            <div className="text-xs font-mono font-bold text-lime-600 dark:text-lime-400 uppercase">
              Module 03
            </div>
            <h3 className="text-2xl font-black uppercase mt-1 mb-3 text-zinc-900 dark:text-zinc-100">
              PC Build Helper
            </h3>
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Inspect interconnect bandwidth, test DDR4 vs DDR5 transfer throughput, analyze dual-channel performance boosts, gauge storage transfer latencies, and pinpoint systemic hardware bottlenecks.
            </p>
          </div>
          <NavLink
            to="/pc-build"
            className="w-full py-2.5 neo-btn bg-lime-300 hover:bg-lime-400 text-black text-center text-xs uppercase font-bold flex items-center justify-center gap-1.5"
          >
            <span>Launch PC Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="p-8 border-3 border-black bg-zinc-100 dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15]">
        <h3 className="font-black text-lg uppercase tracking-tight mb-6 text-zinc-900 dark:text-zinc-100">
          Engineered to Academic & Industrial Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                Step-by-Step Derivations
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Every calculation features an expandable "Show Working" panel with transparent formulas and intermediate arithmetic.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                Zero Cloud Dependence
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                100% client-side pure TypeScript logic. Encodes entire workbench states into shareable URLs with instant reload.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                Unit Accuracy (IEC vs SI)
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Toggles seamlessly between binary prefixes (KiB, MiB, GiB = 1024) and decimal standards (KB, MB, GB = 1000).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
