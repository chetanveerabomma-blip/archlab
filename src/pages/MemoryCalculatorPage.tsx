import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Share2, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { ResultCard } from '../components/common/ResultCard';
import { WorkingPanel } from '../components/common/WorkingPanel';
import { MemoryMap } from '../components/memory/MemoryMap';
import { ChipDecoderVisualizer } from '../components/memory/ChipDecoderVisualizer';
import { ChipTable } from '../components/memory/ChipTable';
import { ShareModal } from '../components/common/ShareModal';
import { useAppStore } from '../store/useAppStore';
import { calculateMemory, calculateReverseMemory } from '../lib/memory';
import { encodeStateToQuery, decodeStateFromQuery } from '../lib/utils';

export const MemoryCalculatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { memoryInputs, setMemoryInputs } = useAppStore();

  const [isReverseMode, setIsReverseMode] = useState(false);
  const [reverseCapacityKiB, setReverseCapacityKiB] = useState(64);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [unitMode, setUnitMode] = useState<'iec' | 'si'>('iec'); // KiB vs KB

  // Initialize from search query if present
  useMemo(() => {
    const q = decodeStateFromQuery<any>(searchParams.toString());
    if (q.addressBusWidth) {
      setMemoryInputs({
        addressBusWidth: Number(q.addressBusWidth),
        dataBusWidth: Number(q.dataBusWidth || 8),
        addressability: q.addressability || 'byte',
        chipLocations: Number(q.chipLocations || 1024),
        chipWordWidth: Number(q.chipWordWidth || 8),
        startAddressHex: q.startAddressHex || '0x0000',
      });
    }
  }, []);

  // Compute forward results
  const forwardResult = useMemo(() => {
    try {
      return calculateMemory(memoryInputs);
    } catch (err: any) {
      return { error: err.message };
    }
  }, [memoryInputs]);

  // Compute reverse results
  const reverseResult = useMemo(() => {
    if (!isReverseMode) return null;
    try {
      return calculateReverseMemory({
        desiredCapacityBytes: reverseCapacityKiB * 1024,
        dataBusWidth: memoryInputs.dataBusWidth,
        addressability: memoryInputs.addressability,
      });
    } catch (err: any) {
      return { error: err.message };
    }
  }, [isReverseMode, reverseCapacityKiB, memoryInputs.dataBusWidth, memoryInputs.addressability]);

  const handleShareClick = () => {
    const query = encodeStateToQuery(memoryInputs);
    setSearchParams(new URLSearchParams(query));
    setIsShareModalOpen(true);
  };

  const shareableUrl = `${window.location.origin}${window.location.pathname}?${encodeStateToQuery(memoryInputs)}`;

  const formattedExportText = useMemo(() => {
    if ('error' in forwardResult) return 'Error in calculation.';
    return `[ArchLab Memory Address Calculation]
Address Bus: ${memoryInputs.addressBusWidth} bits
Data Bus: ${memoryInputs.dataBusWidth} bits (${memoryInputs.addressability}-addressable)
Locations: ${forwardResult.addressableLocations}
Capacity: ${unitMode === 'iec' ? forwardResult.capacityFormatted.kib : forwardResult.capacityFormatted.kb}
Total Chips: ${forwardResult.expansion.totalChips} (${forwardResult.expansion.vertical} rows x ${forwardResult.expansion.horizontal} cols)
Decoder: ${forwardResult.decoder.decoderType}`;
  }, [forwardResult, memoryInputs, unitMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-4 border-black mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
              Module 01
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500">COA Bus & Chip Synthesis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-100">
            Memory Address Calculator
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Analyze address bus widths, horizontal and vertical chip expansions, decoder logic, and explore the interactive physical memory map.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode toggle */}
          <button
            onClick={() => setIsReverseMode(!isReverseMode)}
            className="px-3.5 py-2 neo-btn bg-cyan-300 hover:bg-cyan-400 text-black text-xs flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{isReverseMode ? 'Switch to Forward Mode' : 'Reverse Mode (Capacity ➔ Bits)'}</span>
          </button>

          {/* Unit toggle */}
          <button
            onClick={() => setUnitMode(unitMode === 'iec' ? 'si' : 'iec')}
            className="px-3.5 py-2 neo-btn bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold"
          >
            Unit: {unitMode === 'iec' ? 'KiB / MiB (IEC 1024)' : 'KB / MB (SI 1000)'}
          </button>

          {/* Share */}
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
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 border-3 border-black bg-white dark:bg-zinc-850 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#facc15]">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 pb-2 border-b-2 border-black flex items-center justify-between text-zinc-900 dark:text-zinc-100">
              <span>{isReverseMode ? 'Target Capacity Inputs' : 'System Bus Parameters'}</span>
              <button
                type="button"
                onClick={() =>
                  setMemoryInputs({
                    addressBusWidth: 16,
                    dataBusWidth: 8,
                    addressability: 'byte',
                    chipLocations: 1024,
                    chipWordWidth: 8,
                    startAddressHex: '0x0000',
                  })
                }
                title="Reset to 16-bit Defaults"
                className="hover:rotate-180 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </h3>

            {!isReverseMode ? (
              <div className="space-y-4">
                <InputField
                  label="Address Bus Width"
                  type="number"
                  min={1}
                  max={64}
                  value={memoryInputs.addressBusWidth}
                  onChange={(e) =>
                    setMemoryInputs({ addressBusWidth: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  unit="bits"
                  helperText="e.g. 16 bits = 64K, 32 bits = 4G locations"
                />

                <InputField
                  label="Data Bus Width (Word Size)"
                  type="number"
                  min={1}
                  max={512}
                  value={memoryInputs.dataBusWidth}
                  onChange={(e) =>
                    setMemoryInputs({ dataBusWidth: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  unit="bits"
                  helperText="Word size transferred per cycle (e.g. 8, 16, 32, 64)"
                />

                <SelectField
                  label="Memory Addressability"
                  value={memoryInputs.addressability}
                  onChange={(e) =>
                    setMemoryInputs({ addressability: e.target.value as 'byte' | 'word' })
                  }
                  options={[
                    { value: 'byte', label: 'Byte-Addressable (8 bits per address)' },
                    { value: 'word', label: 'Word-Addressable (Data Bus width per address)' },
                  ]}
                  helperText="Most modern architectures are byte-addressable"
                />

                <div className="pt-2 border-t-2 border-black/20">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-yellow-400 block mb-3">
                    Memory Chip IC Specifications
                  </span>

                  <div className="space-y-4">
                    <InputField
                      label="Locations Per Chip (Depth)"
                      type="number"
                      min={1}
                      value={memoryInputs.chipLocations}
                      onChange={(e) =>
                        setMemoryInputs({ chipLocations: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      helperText="e.g. 1024 (1K), 4096 (4K), 65536 (64K)"
                    />

                    <InputField
                      label="Bits Per Location in Chip (Width)"
                      type="number"
                      min={1}
                      max={64}
                      value={memoryInputs.chipWordWidth}
                      onChange={(e) =>
                        setMemoryInputs({ chipWordWidth: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      unit="bits"
                      helperText="e.g. 8 for 1K x 8, 16 for 1K x 16"
                    />

                    <InputField
                      label="Starting Base Address (Hex)"
                      type="text"
                      value={memoryInputs.startAddressHex || '0x0000'}
                      onChange={(e) => setMemoryInputs({ startAddressHex: e.target.value })}
                      placeholder="0x0000"
                      helperText="Hex base offset (e.g. 0x0000 or 0x8000)"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <InputField
                  label="Desired Memory Capacity"
                  type="number"
                  min={1}
                  value={reverseCapacityKiB}
                  onChange={(e) => setReverseCapacityKiB(Math.max(1, parseInt(e.target.value) || 1))}
                  unit="KiB"
                  helperText="e.g. 64 KiB = 16 bits, 1048576 KiB (1 GiB) = 30 bits"
                />

                <InputField
                  label="Data Bus Width"
                  type="number"
                  min={1}
                  value={memoryInputs.dataBusWidth}
                  onChange={(e) =>
                    setMemoryInputs({ dataBusWidth: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  unit="bits"
                />

                <SelectField
                  label="Addressability"
                  value={memoryInputs.addressability}
                  onChange={(e) =>
                    setMemoryInputs({ addressability: e.target.value as 'byte' | 'word' })
                  }
                  options={[
                    { value: 'byte', label: 'Byte-Addressable (1 Byte per address)' },
                    { value: 'word', label: 'Word-Addressable' },
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculations & Visuals */}
        <div className="lg:col-span-8 space-y-6">
          {!isReverseMode ? (
            'error' in forwardResult ? (
              <div className="p-4 border-3 border-black bg-red-100 text-red-900 font-bold">
                ⚠ {forwardResult.error}
              </div>
            ) : (
              <>
                {/* Result KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ResultCard
                    label="Addressable Locations"
                    value={forwardResult.addressableLocations.toLocaleString()}
                    subtext={`2^${memoryInputs.addressBusWidth} locations`}
                    variant="yellow"
                  />
                  <ResultCard
                    label="Total Memory Capacity"
                    value={
                      unitMode === 'iec'
                        ? forwardResult.capacityFormatted.kib
                        : forwardResult.capacityFormatted.kb
                    }
                    subtext={
                      unitMode === 'iec'
                        ? forwardResult.capacityFormatted.gib
                        : forwardResult.capacityFormatted.gb
                    }
                    variant="cyan"
                  />
                  <ResultCard
                    label="Total Chips Required"
                    value={`${forwardResult.expansion.totalChips} ICs`}
                    subtext={`${forwardResult.expansion.vertical} rows × ${forwardResult.expansion.horizontal} cols`}
                    variant="lime"
                  />
                </div>

                {/* Warnings */}
                {forwardResult.warnings.length > 0 && (
                  <div className="p-4 border-3 border-black bg-amber-100 dark:bg-amber-950/60 shadow-[3px_3px_0px_0px_#000] space-y-2">
                    {forwardResult.warnings.map((w, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 font-mono">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hardware Interconnect & Decoder Block */}
                <ChipDecoderVisualizer
                  decoderType={forwardResult.decoder.decoderType}
                  decoderInputLines={forwardResult.decoder.decoderInputLines}
                  chipOffsetLines={forwardResult.decoder.chipOffsetLines}
                  verticalChips={forwardResult.expansion.vertical}
                  horizontalChips={forwardResult.expansion.horizontal}
                  totalChips={forwardResult.expansion.totalChips}
                />

                {/* Memory Map & Bit partition */}
                <MemoryMap
                  addressBusWidth={memoryInputs.addressBusWidth}
                  offsetBits={forwardResult.decoder.offsetBits}
                  decoderBits={forwardResult.decoder.decoderBits}
                  chipRanges={forwardResult.chipRanges}
                />

                {/* Chip Range Table */}
                <ChipTable ranges={forwardResult.chipRanges} />

                {/* Show Working Step-by-Step Panel */}
                <WorkingPanel steps={forwardResult.steps} defaultOpen={false} />
              </>
            )
          ) : (
            // Reverse Mode Results
            reverseResult && !('error' in reverseResult) && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ResultCard
                    label="Required Address Bus Width"
                    value={`${reverseResult.requiredAddressBits} Bits`}
                    subtext={`Can address up to ${reverseResult.requiredLocations.toLocaleString()} locations`}
                    variant="yellow"
                  />
                  <ResultCard
                    label="Addressable Locations"
                    value={reverseResult.requiredLocations.toLocaleString()}
                    subtext={`Total bytes covered: ${(Number(reverseResult.actualCapacityBytes) / 1024).toFixed(1)} KiB`}
                    variant="cyan"
                  />
                </div>
                <WorkingPanel steps={reverseResult.steps} defaultOpen={true} />
              </div>
            )
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Memory Address Layout"
        shareUrl={shareableUrl}
        exportText={formattedExportText}
      />
    </div>
  );
};
