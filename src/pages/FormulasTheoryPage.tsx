import React from 'react';
import { Layers, Cpu, Database, Binary } from 'lucide-react';

export const FormulasTheoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="pb-6 border-b-4 border-black mb-8">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
            Reference
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500">
            Computer Organization & Architecture (COA) Compendium
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-100">
          Formulas & Theoretical Foundations
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl font-mono">
          Rigorous academic formulas, definitions, and derivations used across all ArchLab calculator engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
        {/* Memory Theory */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <Binary className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base uppercase text-zinc-900 dark:text-zinc-100">
              1. Memory Addressing & Decoding
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-amber-600 dark:text-yellow-400 block mb-1">
                Total Addressable Locations:
              </span>
              <code>N = 2^k</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Where <code>k</code> is the number of lines on the address bus. Each unique binary value from 0 to 2^k - 1 designates one address.
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-amber-600 dark:text-yellow-400 block mb-1">
                Chip Expansion Formulation:
              </span>
              <p>• Horizontal (Word Width): <code>M_H = ⌈Word Size / Chip Width⌉</code></p>
              <p>• Vertical (Capacity Depth): <code>M_V = ⌈Total Locations / Chip Depth⌉</code></p>
              <p>• Total IC Count: <code>Total = M_H × M_V</code></p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-amber-600 dark:text-yellow-400 block mb-1">
                Address Bus Partitioning:
              </span>
              <p>• Chip Offset Lines: <code>b_offset = log₂(Chip Depth)</code></p>
              <p>• Decoder Lines: <code>b_decoder = Total Bits - b_offset</code></p>
              <p>Decoder size is <code>b_decoder-to-2^(b_decoder)</code>.</p>
            </div>
          </div>
        </div>

        {/* CPU Performance Theory */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <Cpu className="w-5 h-5 text-cyan-500" />
            <h3 className="font-black text-base uppercase text-zinc-900 dark:text-zinc-100">
              2. CPU Execution & Throughput
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                The Classic CPU Performance Equation:
              </span>
              <code>CPU Time = (Instruction Count × CPI) / Clock Frequency</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                CPI represents average clock cycles per instruction; Clock Frequency (f) in Hz or GHz.
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                Effective CPI from Instruction Mix:
              </span>
              <code>CPI_eff = ∑ (fraction_i × CPI_i)</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Weights each class (ALU, Load/Store, Branch) by frequency in the program dynamic execution trace.
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                Amdahl's Law (Parallel Acceleration):
              </span>
              <code>Speedup S(p, N) = 1 / ((1 - p) + p / N)</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Where <code>p</code> is the infinitely parallelizable fraction and <code>N</code> is core count. As N ➔ ∞, speedup approaches 1 / (1 - p).
              </p>
            </div>
          </div>
        </div>

        {/* Cache & Memory Hierarchy Theory */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <Layers className="w-5 h-5 text-lime-500" />
            <h3 className="font-black text-base uppercase text-zinc-900 dark:text-zinc-100">
              3. Average Memory Access Time (AMAT)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-lime-600 dark:text-lime-400 block mb-1">
                Multi-Level AMAT Formula:
              </span>
              <code>AMAT = Hit_L1 + MissRate_L1 × (Hit_L2 + MissRate_L2 × (... + Latency_DRAM))</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Measures memory stall latency in cycles seen by the execution pipeline.
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-lime-600 dark:text-lime-400 block mb-1">
                Local vs Global Miss Rates:
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                • Local Miss Rate = Misses in L_i / Accesses to L_i<br />
                • Global Miss Rate = Misses in L_i / Total CPU memory requests
              </p>
            </div>
          </div>
        </div>

        {/* Interconnect & Bandwidth Theory */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <Database className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-base uppercase text-zinc-900 dark:text-zinc-100">
              4. System Interconnect Bandwidth
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                Theoretical Memory Bandwidth:
              </span>
              <code>Bandwidth (GB/s) = (Transfer Rate MT/s × 64 bits × Channels) / (8 × 1000)</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                DDR transfers on both rising and falling edges. Dual-channel mode runs two 64-bit wide memory buses simultaneously, doubling bandwidth.
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                Bandwidth per Core Ratio:
              </span>
              <code>BW_core = Bandwidth / Core Count</code>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                If CPU core density scales faster than memory bandwidth, execution pipelines starve waiting on memory transfers ("Memory Wall").
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
