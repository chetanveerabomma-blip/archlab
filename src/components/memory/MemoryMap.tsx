import React from 'react';
import type { ChipRange } from '../../lib/memory';

interface MemoryMapProps {
  addressBusWidth: number;
  offsetBits: number;
  decoderBits: number;
  chipRanges: ChipRange[];
}

export const MemoryMap: React.FC<MemoryMapProps> = ({
  addressBusWidth,
  offsetBits,
  decoderBits,
  chipRanges,
}) => {
  // Show at most 16 sample chips if there are many
  const displayRanges = chipRanges.slice(0, 16);
  const truncatedCount = chipRanges.length - displayRanges.length;

  const colors = [
    'bg-amber-200 dark:bg-amber-800',
    'bg-cyan-200 dark:bg-cyan-800',
    'bg-emerald-200 dark:bg-emerald-800',
    'bg-rose-200 dark:bg-rose-800',
    'bg-violet-200 dark:bg-violet-800',
    'bg-lime-200 dark:bg-lime-800',
  ];

  return (
    <div className="space-y-6">
      {/* Address Bit Partition Bar */}
      <div className="p-4 border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
        <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
          <span>Address Bus Partition ({addressBusWidth} Bits Total)</span>
          <span className="font-mono text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
            MSB [A{addressBusWidth - 1}] ➔ LSB [A0]
          </span>
        </h4>

        <div className="flex h-12 border-2 border-black overflow-hidden font-mono text-xs font-bold text-black">
          {decoderBits > 0 && (
            <div
              style={{ flex: decoderBits }}
              className="bg-amber-400 flex flex-col items-center justify-center p-1 border-r-2 border-black"
            >
              <span className="truncate">Chip Select / Decoder</span>
              <span className="text-[10px] opacity-80">
                {decoderBits} bits (A{addressBusWidth - 1} .. A{offsetBits})
              </span>
            </div>
          )}
          {offsetBits > 0 && (
            <div
              style={{ flex: offsetBits }}
              className="bg-cyan-300 flex flex-col items-center justify-center p-1"
            >
              <span className="truncate">Internal Chip Offset</span>
              <span className="text-[10px] opacity-80">
                {offsetBits} bits (A{offsetBits - 1} .. A0)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Memory Stack Blocks */}
      <div className="p-4 border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Physical Memory Layout Map (Banks & Address Ranges)
          </h4>
          <span className="text-xs font-mono font-bold bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 border border-black/30">
            {chipRanges.length} Chip Block{chipRanges.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayRanges.map((chip, idx) => {
            const bgClass = colors[idx % colors.length];
            return (
              <div
                key={chip.chipIndex}
                className={`p-3 border-2 border-black ${bgClass} shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between font-mono text-xs`}
              >
                <div className="flex items-center justify-between font-black border-b border-black/30 pb-1 mb-1.5 text-black">
                  <span>Chip #{chip.chipIndex}</span>
                  <span className="text-[10px] bg-black text-white px-1 py-0.2">
                    R{chip.row}:C{chip.col}
                  </span>
                </div>
                <div className="space-y-1 text-black">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">Start:</span>
                    <span className="font-black bg-white/70 px-1">{chip.startHex}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">End:</span>
                    <span className="font-black bg-white/70 px-1">{chip.endHex}</span>
                  </div>
                  <div className="text-[10px] text-zinc-700 mt-1 truncate" title={chip.startBin}>
                    Bin: {chip.startBin.slice(0, 8)}...
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {truncatedCount > 0 && (
          <div className="mt-3 text-center text-xs font-mono font-bold p-2 bg-yellow-100 dark:bg-zinc-900 border-2 border-dashed border-black">
            + {truncatedCount} additional banks mapped identically (view full table below)
          </div>
        )}
      </div>
    </div>
  );
};
