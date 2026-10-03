import React, { useState } from 'react';
import type { ChipRange } from '../../lib/memory';

interface ChipTableProps {
  ranges: ChipRange[];
}

export const ChipTable: React.FC<ChipTableProps> = ({ ranges }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(ranges.length / pageSize);

  const paginatedRanges = ranges.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15] overflow-hidden">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-b-2 border-black flex items-center justify-between">
        <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Chip Address Ranges & Mapping Table
        </h4>
        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
          Showing {paginatedRanges.length} of {ranges.length} chips
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-200 dark:bg-zinc-950 border-b-2 border-black text-black dark:text-zinc-200 uppercase">
              <th className="p-2.5 border-r border-black">Chip #</th>
              <th className="p-2.5 border-r border-black">Bank (Row:Col)</th>
              <th className="p-2.5 border-r border-black">Hex Range (Start - End)</th>
              <th className="p-2.5 border-r border-black">Binary Start Address</th>
              <th className="p-2.5">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRanges.map((chip, idx) => (
              <tr
                key={chip.chipIndex}
                className={`border-b border-black/20 hover:bg-yellow-50 dark:hover:bg-zinc-700/50 ${
                  idx % 2 === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-zinc-50 dark:bg-zinc-850'
                }`}
              >
                <td className="p-2.5 font-black border-r border-black/30">Chip {chip.chipIndex}</td>
                <td className="p-2.5 border-r border-black/30">
                  R{chip.row} : C{chip.col}
                </td>
                <td className="p-2.5 font-bold text-amber-700 dark:text-yellow-400 border-r border-black/30">
                  {chip.startHex} ➔ {chip.endHex}
                </td>
                <td className="p-2.5 text-zinc-600 dark:text-zinc-400 border-r border-black/30 truncate max-w-[180px]">
                  {chip.startBin}
                </td>
                <td className="p-2.5 font-semibold">
                  {(chip.sizeBytes / 1024).toFixed(1)} KiB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border-t-2 border-black flex items-center justify-between font-mono text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 neo-btn bg-white disabled:opacity-50 text-xs"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 neo-btn bg-white disabled:opacity-50 text-xs"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
