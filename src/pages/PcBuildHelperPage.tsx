import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Save,
  Share2,
  Trash2,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { ResultCard } from '../components/common/ResultCard';
import { WorkingPanel } from '../components/common/WorkingPanel';
import { ArchitectureDiagram } from '../components/pcbuild/ArchitectureDiagram';
import { ShareModal } from '../components/common/ShareModal';
import { useAppStore } from '../store/useAppStore';
import { evaluatePcBuild } from '../lib/pcbuild';
import type { PcBuildInputs, UseCase } from '../lib/pcbuild';
import {
  EXAMPLE_CPU_BUILD_PRESETS,
  EXAMPLE_RAM_PRESETS,
  EXAMPLE_STORAGE_PRESETS,
  EXAMPLE_GPU_PRESETS,
} from '../data/presets';
import { encodeStateToQuery, decodeStateFromQuery } from '../lib/utils';

export const PcBuildHelperPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedBuilds, saveBuild, deleteBuild } = useAppStore();

  const [useCase, setUseCase] = useState<UseCase>('gaming');
  const [cpuPresetIndex, setCpuPresetIndex] = useState(1); // Mainstream 8-Core
  const [ramPresetIndex, setRamPresetIndex] = useState(1); // DDR5-5600 Dual Channel
  const [storagePresetIndex, setStoragePresetIndex] = useState(1); // PCIe Gen4
  const [gpuPresetIndex, setGpuPresetIndex] = useState(1); // Mid-range GPU
  const [testFileSizeGb, setTestFileSizeGb] = useState(25);

  const [saveBuildName, setSaveBuildName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load from search params if present
  useMemo(() => {
    const q = decodeStateFromQuery<any>(searchParams.toString());
    if (q.useCase) setUseCase(q.useCase);
    if (q.cpuIdx !== undefined) setCpuPresetIndex(Number(q.cpuIdx));
    if (q.ramIdx !== undefined) setRamPresetIndex(Number(q.ramIdx));
    if (q.storageIdx !== undefined) setStoragePresetIndex(Number(q.storageIdx));
    if (q.gpuIdx !== undefined) setGpuPresetIndex(Number(q.gpuIdx));
    if (q.testFileSizeGb !== undefined) setTestFileSizeGb(Number(q.testFileSizeGb));
  }, []);

  // Build inputs object
  const buildInputs: PcBuildInputs = useMemo(() => {
    return {
      useCase,
      cpu: EXAMPLE_CPU_BUILD_PRESETS[cpuPresetIndex].spec,
      ram: EXAMPLE_RAM_PRESETS[ramPresetIndex].spec,
      storage: EXAMPLE_STORAGE_PRESETS[storagePresetIndex].spec,
      gpu: EXAMPLE_GPU_PRESETS[gpuPresetIndex].spec,
      testFileSizeGb,
    };
  }, [useCase, cpuPresetIndex, ramPresetIndex, storagePresetIndex, gpuPresetIndex, testFileSizeGb]);

  // Evaluate build
  const buildResult = useMemo(() => {
    return evaluatePcBuild(buildInputs);
  }, [buildInputs]);

  const handleSaveBuild = () => {
    const name = saveBuildName.trim() || `${buildInputs.cpu.name} Build`;
    saveBuild(name, buildInputs);
    setSaveBuildName('');
  };

  const handleShareClick = () => {
    const query = encodeStateToQuery({
      useCase,
      cpuIdx: cpuPresetIndex,
      ramIdx: ramPresetIndex,
      storageIdx: storagePresetIndex,
      gpuIdx: gpuPresetIndex,
      testFileSizeGb,
    });
    setSearchParams(new URLSearchParams(query));
    setIsShareModalOpen(true);
  };

  const shareableUrl = `${window.location.origin}${window.location.pathname}?${encodeStateToQuery({
    useCase,
    cpuIdx: cpuPresetIndex,
    ramIdx: ramPresetIndex,
    storageIdx: storagePresetIndex,
    gpuIdx: gpuPresetIndex,
    testFileSizeGb,
  })}`;

  const formattedExportText = `[ArchLab PC Build Analysis]
Target Workload: ${useCase.toUpperCase()}
Balance Score: ${buildResult.overallBalanceScore}/100
Weakest Link: ${buildResult.weakestLink}
RAM Bandwidth: ${buildResult.memoryBandwidthGBs} GB/s (${buildResult.isDualChannelActive ? 'Dual-Channel' : 'Single-Channel'})
Storage Load Time (25GB): ${buildResult.storageLoadTimeSeconds} seconds
Top Recommendation: ${buildResult.recommendations[0] || 'Build is well balanced'}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-4 border-black mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
              Module 03
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500">
              System Interconnect & Bottleneck Balance
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-100">
            PC Build Helper
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Evaluate hardware synergy, calculate theoretical memory bandwidth (GB/s), dual-channel compliance, storage latency, and diagnose component bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="px-3.5 py-2 neo-btn bg-amber-400 hover:bg-amber-500 text-black text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share / Export</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Configurator Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15] space-y-5">
            <h3 className="font-black text-sm uppercase tracking-wider pb-2 border-b-2 border-black text-zinc-900 dark:text-zinc-100">
              System Configuration
            </h3>

            <SelectField
              label="Primary Workload / Use Case"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              options={[
                { value: 'gaming', label: 'Gaming & High-FPS Esports' },
                { value: 'programming', label: 'Software Engineering & Compiles' },
                { value: 'video_editing', label: '4K/8K Video Editing & Render' },
                { value: 'ai_ml', label: 'Machine Learning & Local LLMs' },
                { value: 'office', label: 'General Productivity & Office' },
              ]}
              helperText="Tailors scoring weights and capacity thresholds"
            />

            <SelectField
              label="Processor (CPU Architecture)"
              value={cpuPresetIndex.toString()}
              onChange={(e) => setCpuPresetIndex(parseInt(e.target.value))}
              options={EXAMPLE_CPU_BUILD_PRESETS.map((p, i) => ({
                value: i.toString(),
                label: p.label,
              }))}
            />

            <SelectField
              label="System Memory (RAM Kit)"
              value={ramPresetIndex.toString()}
              onChange={(e) => setRamPresetIndex(parseInt(e.target.value))}
              options={EXAMPLE_RAM_PRESETS.map((p, i) => ({
                value: i.toString(),
                label: p.label,
              }))}
            />

            <SelectField
              label="Primary Storage (OS & Assets)"
              value={storagePresetIndex.toString()}
              onChange={(e) => setStoragePresetIndex(parseInt(e.target.value))}
              options={EXAMPLE_STORAGE_PRESETS.map((p, i) => ({
                value: i.toString(),
                label: p.label,
              }))}
            />

            <SelectField
              label="Graphics Card (GPU Tier)"
              value={gpuPresetIndex.toString()}
              onChange={(e) => setGpuPresetIndex(parseInt(e.target.value))}
              options={EXAMPLE_GPU_PRESETS.map((p, i) => ({
                value: i.toString(),
                label: p.label,
              }))}
            />

            <InputField
              label="Asset Load Test File Size"
              type="number"
              min={1}
              max={500}
              value={testFileSizeGb}
              onChange={(e) => setTestFileSizeGb(Math.max(1, parseInt(e.target.value) || 1))}
              unit="GB"
              helperText="Simulated game install or dataset transfer"
            />
          </div>

          {/* Saved Builds Card */}
          <div className="p-5 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15]">
            <h3 className="font-black text-sm uppercase tracking-wider pb-2 border-b-2 border-black flex items-center justify-between text-zinc-900 dark:text-zinc-100">
              <span>Save & Compare Configurations (Max 3)</span>
              <Save className="w-4 h-4" />
            </h3>

            <div className="flex gap-2 mt-3 mb-4">
              <input
                type="text"
                placeholder="Name this build (e.g. My Rig)"
                value={saveBuildName}
                onChange={(e) => setSaveBuildName(e.target.value)}
                className="w-full text-xs font-mono p-2 neo-input bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <button
                onClick={handleSaveBuild}
                className="px-4 py-2 neo-btn bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold whitespace-nowrap"
              >
                Save
              </button>
            </div>

            <div className="space-y-2">
              {savedBuilds.length === 0 ? (
                <div className="text-xs font-mono text-zinc-500 text-center py-2">
                  No saved builds yet. Save current spec to compare!
                </div>
              ) : (
                savedBuilds.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border-2 border-black flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold">{b.name}</span>
                      <span className="text-[10px] text-zinc-500 block">
                        {b.inputs.cpu.name} • {b.inputs.ram.capacityGb}GB {b.inputs.ram.type}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteBuild(b.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Memory Bandwidth"
              value={`${buildResult.memoryBandwidthGBs} GB/s`}
              subtext={`${buildResult.bandwidthPerCoreGBs} GB/s per core`}
              variant="yellow"
            />
            <ResultCard
              label="Storage Load Time"
              value={`${buildResult.storageLoadTimeSeconds} s`}
              subtext={`For ${testFileSizeGb} GB file`}
              variant="cyan"
            />
            <ResultCard
              label="Balance Score"
              value={`${buildResult.overallBalanceScore} / 100`}
              subtext={`Weakest: ${buildResult.weakestLink}`}
              variant="lime"
            />
          </div>

          {/* Warnings & Channel Check */}
          {buildResult.channelWarning && (
            <div className="p-4 border-3 border-black bg-rose-100 dark:bg-rose-950/60 shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs uppercase text-rose-950 dark:text-rose-200">
                  Dual-Channel Check Warning:
                </span>
                <p className="text-xs font-mono text-rose-900 dark:text-rose-300 mt-0.5">
                  {buildResult.channelWarning}
                </p>
              </div>
            </div>
          )}

          {/* Architecture Block Diagram with Flow Vectors */}
          <ArchitectureDiagram
            cpuName={buildInputs.cpu.name}
            cores={buildInputs.cpu.cores}
            memoryBandwidthGBs={buildResult.memoryBandwidthGBs}
            storageSpeedMBs={buildInputs.storage.readSpeedMBs}
            isDualChannel={buildResult.isDualChannelActive}
          />

          {/* Component Balance Gauges */}
          <div className="p-5 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15]">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Component Bottleneck Diagnostic (0 - 100 Scoring)</span>
              <Gauge className="w-4 h-4 text-amber-500" />
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {Object.entries(buildResult.componentScores).map(([key, comp]) => {
                if (!comp) return null;
                const isWeakest = comp.name.toLowerCase().includes(buildResult.weakestLink.toLowerCase());
                return (
                  <div
                    key={key}
                    className={`p-3 border-2 border-black ${
                      isWeakest
                        ? 'bg-amber-100 dark:bg-amber-950/60'
                        : 'bg-zinc-50 dark:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black uppercase flex items-center gap-1.5">
                        {comp.name}
                        {isWeakest && (
                          <span className="text-[9px] bg-red-600 text-white px-1 font-bold">
                            WEAKEST LINK
                          </span>
                        )}
                      </span>
                      <span className="font-black text-sm">{comp.score}/100</span>
                    </div>

                    <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 border border-black overflow-hidden mb-1.5">
                      <div
                        style={{ width: `${comp.score}%` }}
                        className={`h-full ${
                          comp.score >= 80
                            ? 'bg-emerald-500'
                            : comp.score >= 60
                            ? 'bg-yellow-400'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400">{comp.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations Banner */}
          {buildResult.recommendations.length > 0 && (
            <div className="p-4 border-3 border-black bg-yellow-100 dark:bg-zinc-900 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
              <div className="flex items-center gap-2 font-black text-xs uppercase mb-2 text-zinc-900 dark:text-zinc-100">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Architecture Optimization Recommendations</span>
              </div>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs text-zinc-800 dark:text-zinc-300">
                {buildResult.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Derivations & Step-by-Step Working */}
          <WorkingPanel steps={buildResult.steps} defaultOpen={false} />
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="PC Build Analysis"
        shareUrl={shareableUrl}
        exportText={formattedExportText}
      />
    </div>
  );
};
