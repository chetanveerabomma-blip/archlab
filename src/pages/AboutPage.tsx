import React from 'react';
import { Info, Layers, CheckCircle, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="pb-6 border-b-4 border-black mb-8">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
            Manifesto
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500">
            About ArchLab Architecture
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-100">
          About ArchLab
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
          An open educational toolkit translating abstract Computer Organization and Architecture (COA) principles into interactive physical intuition.
        </p>
      </div>

      <div className="space-y-8 font-mono text-xs">
        {/* Design System Section */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 text-base font-black uppercase text-zinc-900 dark:text-zinc-100">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Neobrutalism Design Philosophy</span>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
            ArchLab adopts <strong>Bold Neobrutalism</strong>—high-contrast 3px and 4px solid black borders, hard drop shadows with zero blur, vivid warning colors (yellow, cyan, lime, rose), and monospace typography. This style directly reflects the discrete, binary, and deterministic nature of digital hardware logic.
          </p>
        </div>

        {/* Units Guide Section */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 text-base font-black uppercase text-zinc-900 dark:text-zinc-100">
            <Info className="w-5 h-5 text-cyan-500" />
            <span>Units & Prefix Standards (IEC vs SI)</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-cyan-700 dark:text-cyan-400 block mb-1">
                Binary Prefixes (IEC 60027-2 standard):
              </span>
              <p>• 1 KiB (Kibibyte) = 2¹⁰ bytes = 1,024 bytes</p>
              <p>• 1 MiB (Mebibyte) = 2²⁰ bytes = 1,048,576 bytes</p>
              <p>• 1 GiB (Gibibyte) = 2³⁰ bytes = 1,073,741,824 bytes</p>
              <p className="text-zinc-500 mt-1">
                Standard in operating systems (RAM capacity, cache sizes, memory-mapped address spans).
              </p>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-black">
              <span className="font-bold text-cyan-700 dark:text-cyan-400 block mb-1">
                Decimal Prefixes (SI standard):
              </span>
              <p>• 1 KB (Kilobyte) = 10³ bytes = 1,000 bytes</p>
              <p>• 1 MB (Megabyte) = 10⁶ bytes = 1,000,000 bytes</p>
              <p>• 1 GB (Gigabyte) = 10⁹ bytes = 1,000,000,000 bytes</p>
              <p className="text-zinc-500 mt-1">
                Standard in storage drives (HDD/SSD packaging) and network communication bitrates.
              </p>
            </div>
          </div>
        </div>

        {/* Reliability & Client Side */}
        <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-4">
          <div className="flex items-center gap-2 text-base font-black uppercase text-zinc-900 dark:text-zinc-100">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>Pure Client-Side Architecture</span>
          </div>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Zero server round-trips. Calculations execute in under 1 millisecond.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Safe `localStorage` persistence wrapped in exception boundaries.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tested with Vitest against standard textbook benchmarks (Patterson & Hennessy).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
