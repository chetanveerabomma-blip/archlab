import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Layers, ArrowRight } from 'lucide-react';

interface ArchitectureDiagramProps {
  cpuName: string;
  cores: number;
  memoryBandwidthGBs: number;
  storageSpeedMBs: number;
  isDualChannel: boolean;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  cpuName,
  cores,
  memoryBandwidthGBs,
  storageSpeedMBs,
  isDualChannel,
}) => {
  // Arrow stroke dynamic widths based on bandwidth
  // RAM BW: 25 to 100 GB/s -> stroke 4px to 12px
  const ramStrokeWidth = Math.max(3, Math.min(12, Math.round(memoryBandwidthGBs / 10)));
  
  // Storage BW: 0.15 to 12 GB/s -> stroke 2px to 6px
  const storageGBs = storageSpeedMBs / 1000;
  const storageStrokeWidth = Math.max(2, Math.min(6, Math.round(storageGBs)));

  return (
    <div className="p-6 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15]">
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-black">
        <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Hardware Interconnect & Data-Flow Vector Diagram
        </h4>
        <span className="font-mono text-xs font-bold text-zinc-500">
          Thickness reflects theoretical transfer bandwidth
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-4">
        {/* 1. CPU Core Complex */}
        <div className="p-4 bg-amber-300 dark:bg-yellow-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] text-black w-full lg:w-1/4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-black text-sm uppercase">
            <Cpu className="w-5 h-5" />
            <span>CPU Core Complex</span>
          </div>
          <div className="font-mono font-bold text-xs mt-1 truncate">{cpuName}</div>
          <div className="font-mono text-[11px] mt-2 bg-black text-white px-2 py-0.5 inline-block">
            {cores} Cores Active
          </div>
        </div>

        {/* Vector: CPU <-> L1/L2/L3 Cache */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="flex items-center text-xs font-mono font-black"
          >
            <div style={{ height: `${ramStrokeWidth}px` }} className="w-12 bg-black dark:bg-yellow-400" />
            <ArrowRight className="w-5 h-5 text-black dark:text-yellow-400 -ml-1" />
          </motion.div>
          <span className="font-mono text-[10px] font-bold mt-1 text-zinc-600 dark:text-zinc-400">
            L1/L2/L3 On-Die
          </span>
        </div>

        {/* 2. Main System RAM */}
        <div className="p-4 bg-cyan-300 dark:bg-cyan-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] text-black w-full lg:w-1/4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-black text-sm uppercase">
            <Layers className="w-5 h-5" />
            <span>System Memory (DRAM)</span>
          </div>
          <div className="font-mono font-black text-lg mt-1">
            {memoryBandwidthGBs} GB/s
          </div>
          <div className="font-mono text-[10px] font-bold mt-1">
            {isDualChannel ? '✓ Dual/Multi-Channel Active' : '⚠ Single-Channel Mode'}
          </div>
        </div>

        {/* Vector: RAM <-> Storage Bus (PCIe / SATA) */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2.0 }}
            className="flex items-center text-xs font-mono font-black"
          >
            <div
              style={{ height: `${storageStrokeWidth}px` }}
              className="w-12 bg-black dark:bg-yellow-400"
            />
            <ArrowRight className="w-4 h-4 text-black dark:text-yellow-400 -ml-1" />
          </motion.div>
          <span className="font-mono text-[10px] font-bold mt-1 text-zinc-600 dark:text-zinc-400">
            PCIe/SATA Bus
          </span>
        </div>

        {/* 3. Non-Volatile Storage */}
        <div className="p-4 bg-lime-300 dark:bg-lime-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] text-black w-full lg:w-1/4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-black text-sm uppercase">
            <HardDrive className="w-5 h-5" />
            <span>Non-Volatile Storage</span>
          </div>
          <div className="font-mono font-black text-lg mt-1">
            {storageSpeedMBs} MB/s
          </div>
          <div className="font-mono text-[10px] font-bold mt-1">
            {(storageSpeedMBs / 1000).toFixed(2)} GB/s Sequential
          </div>
        </div>
      </div>
    </div>
  );
};
