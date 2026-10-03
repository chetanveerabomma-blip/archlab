import React from 'react';
import { Cpu as ChipIcon, ArrowRight } from 'lucide-react';

interface ChipDecoderVisualizerProps {
  decoderType: string;
  decoderInputLines: string;
  chipOffsetLines: string;
  verticalChips: number;
  horizontalChips: number;
  totalChips: number;
}

export const ChipDecoderVisualizer: React.FC<ChipDecoderVisualizerProps> = ({
  decoderType,
  decoderInputLines,
  chipOffsetLines,
  verticalChips,
  horizontalChips,
  totalChips,
}) => {
  return (
    <div className="p-5 border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
      <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
        <ChipIcon className="w-4 h-4 text-amber-500" />
        <span>Hardware Chip-Select Decoder & Interconnect Schematic</span>
      </h4>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black font-mono">
        {/* Address Lines In */}
        <div className="flex flex-col gap-2 text-center w-full lg:w-1/4">
          <div className="p-2 bg-amber-200 dark:bg-amber-900/60 border-2 border-black font-bold text-xs">
            <div className="text-[10px] uppercase text-zinc-600 dark:text-zinc-300">Decoder Bus Lines</div>
            <div>{decoderInputLines}</div>
          </div>
          <div className="p-2 bg-cyan-200 dark:bg-cyan-900/60 border-2 border-black font-bold text-xs">
            <div className="text-[10px] uppercase text-zinc-600 dark:text-zinc-300">Chip Offset Bus Lines</div>
            <div>{chipOffsetLines}</div>
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-black dark:text-yellow-400 hidden lg:block" />

        {/* Decoder Block */}
        <div className="p-4 bg-yellow-300 dark:bg-yellow-500 text-black border-3 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col items-center justify-center text-center w-full lg:w-1/3">
          <div className="font-black text-sm uppercase">Active Decoder</div>
          <div className="font-mono text-xs font-bold mt-1 bg-black text-white px-2 py-0.5">
            {decoderType}
          </div>
          <div className="text-[10px] mt-2 font-semibold">
            Produces {verticalChips} Chip Select (CS) Enable Lines
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-black dark:text-yellow-400 hidden lg:block" />

        {/* Memory Array Array */}
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border-2 border-black text-center w-full lg:w-1/3">
          <div className="font-bold text-xs uppercase text-zinc-800 dark:text-zinc-200">
            Memory IC Grid
          </div>
          <div className="font-black text-base text-emerald-800 dark:text-emerald-300 mt-1">
            {verticalChips} Rows × {horizontalChips} Columns
          </div>
          <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
            Total {totalChips} ICs connected
          </div>
        </div>
      </div>
    </div>
  );
};
