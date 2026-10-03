import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Cpu as CpuIcon,
  Plus,
  Trash2,
  Award,
  Zap,
  Layers,
  Share2,
} from 'lucide-react';
import { InputField } from '../components/common/InputField';
import { WorkingPanel } from '../components/common/WorkingPanel';
import { CpuComparisonCharts } from '../components/cpu/CpuComparisonCharts';
import { AmdahlSlider } from '../components/cpu/AmdahlSlider';
import { ShareModal } from '../components/common/ShareModal';
import { useAppStore } from '../store/useAppStore';
import { compareCpus } from '../lib/cpu';
import type { CpuProfile } from '../lib/cpu';
import { EXAMPLE_CPUS } from '../data/presets';
import { encodeStateToQuery, decodeStateFromQuery } from '../lib/utils';

export const CpuComparerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    selectedCpus,
    baselineCpuId,
    setBaselineCpuId,
    updateCpu,
    addCpu,
    removeCpu,
  } = useAppStore();

  const [parallelFraction, setParallelFraction] = useState(0.8); // 80% parallel
  const [refInstructions, setRefInstructions] = useState(1000); // 1000 Million = 1 Billion
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Initialize from search if present
  useMemo(() => {
    const q = decodeStateFromQuery<any>(searchParams.toString());
    if (q.baselineCpuId) {
      setBaselineCpuId(q.baselineCpuId);
    }
  }, []);

  // Compute comparison
  const comparisonResult = useMemo(() => {
    try {
      return compareCpus(selectedCpus, baselineCpuId, refInstructions);
    } catch (err: any) {
      return { error: err.message };
    }
  }, [selectedCpus, baselineCpuId, refInstructions]);

  const handleAddPreset = (preset: CpuProfile) => {
    if (selectedCpus.length >= 4) return;
    const newCpu: CpuProfile = {
      ...preset,
      id: 'cpu-' + Date.now(),
      name: `${preset.name} (Copy)`,
    };
    addCpu(newCpu);
  };

  const handleShareClick = () => {
    const query = encodeStateToQuery({
      baselineCpuId,
      refInstructions,
    });
    setSearchParams(new URLSearchParams(query));
    setIsShareModalOpen(true);
  };

  const shareableUrl = `${window.location.origin}${window.location.pathname}?${encodeStateToQuery({
    baselineCpuId,
    refInstructions,
  })}`;

  const formattedExportText = useMemo(() => {
    if ('error' in comparisonResult) return 'Error calculating comparisons.';
    return `[ArchLab CPU Spec Comparison]
CPUs Compared: ${selectedCpus.map((c) => c.name).join(' vs ')}
Workload Base: ${refInstructions} Million Instructions
Overall Winner: ${comparisonResult.winners.overall}
Single-Thread Leader: ${comparisonResult.winners.singleThread}
Multi-Thread Leader: ${comparisonResult.winners.multiThread}
Cache Efficiency: ${comparisonResult.winners.cacheEfficiency}`;
  }, [comparisonResult, selectedCpus, refInstructions]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-4 border-black mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
              Module 02
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500">
              CPU Performance Equations & Multi-Level Cache
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-100">
            CPU Spec Comparer
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Compare 2 to 4 microprocessors side-by-side. Calculate CPU execution time, effective CPI from instruction mix, MIPS, Amdahl's Law scaling, and AMAT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-1 px-3 border-2 border-black font-mono text-xs">
            <span className="font-bold">Workload:</span>
            <input
              type="number"
              min="10"
              max="100000"
              value={refInstructions}
              onChange={(e) => setRefInstructions(Math.max(1, parseInt(e.target.value) || 1000))}
              className="w-20 px-1 py-0.5 border border-black text-center font-bold"
            />
            <span className="text-zinc-500">M Inst</span>
          </div>

          <button
            onClick={handleShareClick}
            className="px-3.5 py-2 neo-btn bg-amber-400 hover:bg-amber-500 text-black text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share / Export</span>
          </button>
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="p-4 border-3 border-black bg-zinc-100 dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15] mb-8 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Quick Presets (Example Specs Only):
        </span>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CPUS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddPreset(preset)}
              disabled={selectedCpus.length >= 4}
              className="px-3 py-1.5 neo-btn bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs disabled:opacity-50 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{preset.name.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side CPU Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selectedCpus.map((cpu, idx) => (
          <div
            key={cpu.id}
            className={`p-4 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] flex flex-col justify-between ${
              baselineCpuId === cpu.id ? 'ring-3 ring-amber-400' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
                <span className="font-mono font-black text-xs uppercase bg-black text-white px-2 py-0.5">
                  CPU Slot #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBaselineCpuId(cpu.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 border border-black ${
                      baselineCpuId === cpu.id
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {baselineCpuId === cpu.id ? '★ Baseline' : 'Set Baseline'}
                  </button>
                  {selectedCpus.length > 2 && (
                    <button
                      onClick={() => removeCpu(cpu.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove CPU"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <InputField
                  label="Name / Model"
                  type="text"
                  value={cpu.name}
                  onChange={(e) => updateCpu(idx, { ...cpu, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Clock Rate"
                    type="number"
                    step="0.1"
                    min={0.5}
                    value={cpu.clockGhz}
                    onChange={(e) =>
                      updateCpu(idx, { ...cpu, clockGhz: parseFloat(e.target.value) || 1.0 })
                    }
                    unit="GHz"
                  />
                  <InputField
                    label="Cores"
                    type="number"
                    min={1}
                    value={cpu.cores}
                    onChange={(e) =>
                      updateCpu(idx, { ...cpu, cores: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="IPC Rating"
                    type="number"
                    step="0.05"
                    min={0.1}
                    value={cpu.ipc}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 1.0;
                      updateCpu(idx, { ...cpu, ipc: val, cpi: Number((1 / val).toFixed(3)) });
                    }}
                  />
                  <InputField
                    label="Base CPI"
                    type="number"
                    step="0.05"
                    min={0.1}
                    value={cpu.cpi || Number((1 / cpu.ipc).toFixed(3))}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 1.0;
                      updateCpu(idx, { ...cpu, cpi: val, ipc: Number((1 / val).toFixed(3)) });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Instruction Mix Teaser */}
            <div className="mt-4 pt-3 border-t-2 border-black/20 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <span className="font-bold">Instruction Mix: </span>
              {cpu.instructionMix
                ? cpu.instructionMix.map((m) => `${m.name.split(' ')[0]}: ${m.percentage}%`).join(' | ')
                : 'Uniform 1.0 CPI'}
            </div>
          </div>
        ))}
      </div>

      {/* Results & Visuals */}
      {'error' in comparisonResult ? (
        <div className="p-4 border-3 border-black bg-red-100 text-red-900 font-bold">
          ⚠ {comparisonResult.error}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Winner Badges Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border-3 border-black bg-amber-300 dark:bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <Award className="w-8 h-8 shrink-0 text-black" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Overall Winner
                </span>
                <span className="font-mono font-black text-sm truncate block">
                  {comparisonResult.winners.overall}
                </span>
              </div>
            </div>

            <div className="p-4 border-3 border-black bg-cyan-300 dark:bg-cyan-400 text-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <Zap className="w-8 h-8 shrink-0 text-black" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Single-Thread Speed
                </span>
                <span className="font-mono font-black text-sm truncate block">
                  {comparisonResult.winners.singleThread}
                </span>
              </div>
            </div>

            <div className="p-4 border-3 border-black bg-lime-300 dark:bg-lime-400 text-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <Layers className="w-8 h-8 shrink-0 text-black" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Multi-Core Scaling
                </span>
                <span className="font-mono font-black text-sm truncate block">
                  {comparisonResult.winners.multiThread}
                </span>
              </div>
            </div>

            <div className="p-4 border-3 border-black bg-pink-300 dark:bg-pink-400 text-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <CpuIcon className="w-8 h-8 shrink-0 text-black" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Cache / AMAT Efficiency
                </span>
                <span className="font-mono font-black text-sm truncate block">
                  {comparisonResult.winners.cacheEfficiency}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Comparison Table */}
          <div className="border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-200 dark:bg-zinc-950 border-b-2 border-black text-black dark:text-zinc-200 uppercase">
                  <th className="p-3 border-r border-black">CPU Model</th>
                  <th className="p-3 border-r border-black">Effective CPI / IPC</th>
                  <th className="p-3 border-r border-black">Throughput (MIPS)</th>
                  <th className="p-3 border-r border-black">CPU Time ({refInstructions}M inst)</th>
                  <th className="p-3 border-r border-black">Speedup vs Baseline</th>
                  <th className="p-3 border-r border-black">AMAT (Cycles)</th>
                  <th className="p-3">Composite Score</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResult.cpus.map((cpu, idx) => (
                  <tr
                    key={cpu.id}
                    className={`border-b border-black/20 ${
                      idx % 2 === 0 ? 'bg-white dark:bg-zinc-850' : 'bg-zinc-50 dark:bg-zinc-900'
                    }`}
                  >
                    <td className="p-3 font-bold border-r border-black/30 flex items-center gap-2">
                      <span>{cpu.name}</span>
                      {cpu.id === baselineCpuId && (
                        <span className="text-[9px] bg-amber-400 text-black px-1 border border-black">
                          BASELINE
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-r border-black/30">
                      CPI: {cpu.effectiveCpi} | IPC: {cpu.effectiveIpc}
                    </td>
                    <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400 border-r border-black/30">
                      {cpu.mips.toLocaleString()} MIPS
                    </td>
                    <td className="p-3 border-r border-black/30">
                      {cpu.cpuTimeSeconds} s
                    </td>
                    <td className="p-3 font-black text-amber-600 dark:text-yellow-400 border-r border-black/30">
                      {comparisonResult.speedups[cpu.id]}x
                    </td>
                    <td className="p-3 border-r border-black/30">
                      {cpu.amatCycles} cycles
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">
                      {cpu.overallScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive Amdahl Scaling */}
          <AmdahlSlider
            parallelFraction={parallelFraction}
            onChange={setParallelFraction}
            cpus={selectedCpus.map((c) => ({ name: c.name, cores: c.cores }))}
          />

          {/* Graphical Visualizations: Grouped Bar & Radar */}
          <CpuComparisonCharts metrics={comparisonResult.cpus} />

          {/* Derivations & Working */}
          <WorkingPanel steps={comparisonResult.steps} defaultOpen={false} />
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="CPU Spec Comparison"
        shareUrl={shareableUrl}
        exportText={formattedExportText}
      />
    </div>
  );
};
