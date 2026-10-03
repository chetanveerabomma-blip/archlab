/**
 * ArchLab - Pure TypeScript CPU Spec Comparison Engine
 * Computes CPU execution time, effective CPI from instruction mix,
 * MIPS, relative speedup, Amdahl's Law multicore scaling, and multi-level AMAT.
 */

export interface InstructionClass {
  name: string;
  percentage: number; // e.g. 40 (meaning 40%)
  cpi: number;        // CPI for this class
}

export interface CacheLevel {
  level: string;        // 'L1' | 'L2' | 'L3'
  sizeKB: number;
  hitTimeCycles: number; // Hit latency in cycles
  missRate: number;      // e.g. 0.05 for 5%
}

export interface CpuProfile {
  id: string;
  name: string;
  clockGhz: number;     // e.g. 3.5 GHz
  cores: number;        // e.g. 8
  threads: number;      // e.g. 16
  ipc: number;          // Instructions Per Cycle (if provided directly)
  cpi?: number;         // Cycles Per Instruction (1/ipc)
  instructionCountMillions?: number; // e.g. 1000 million (1 Billion)
  instructionMix?: InstructionClass[];
  caches?: CacheLevel[];
  ramLatencyCycles?: number; // e.g. 150 cycles
}

export interface CpuMetrics {
  id: string;
  name: string;
  clockGhz: number;
  cores: number;
  effectiveCpi: number;
  effectiveIpc: number;
  mips: number;
  cpuTimeSeconds: number; // for reference instruction count
  amatCycles: number;
  singleThreadScore: number;
  multiThreadScore: number;
  overallScore: number;
}

export interface CpuComparisonResult {
  cpus: CpuMetrics[];
  baselineId: string;
  speedups: { [cpuId: string]: number }; // relative to baseline
  winners: {
    singleThread: string;
    multiThread: string;
    cacheEfficiency: string;
    overall: string;
  };
  steps: { title: string; formula: string; calculation: string; result: string }[];
}

export function calculateEffectiveCpi(mix: InstructionClass[]): number {
  if (!mix || mix.length === 0) return 1.0;
  const totalWeight = mix.reduce((sum, item) => sum + item.percentage, 0);
  if (totalWeight <= 0) return 1.0;
  
  const weightedCpi = mix.reduce((sum, item) => sum + (item.percentage / totalWeight) * item.cpi, 0);
  return Number(weightedCpi.toFixed(4));
}

export function calculateAmat(caches: CacheLevel[], ramLatencyCycles: number): number {
  if (!caches || caches.length === 0) return ramLatencyCycles;

  // AMAT multi-level formula:
  // AMAT = HitL1 + MissL1 * (HitL2 + MissL2 * (HitL3 + MissL3 * LatencyRAM))
  // We evaluate from deepest level outwards
  let penalty = ramLatencyCycles;
  for (let i = caches.length - 1; i >= 0; i--) {
    const c = caches[i];
    penalty = c.hitTimeCycles + c.missRate * penalty;
  }
  return Number(penalty.toFixed(2));
}

export function calculateAmdahlSpeedup(parallelFraction: number, cores: number): number {
  const p = Math.max(0, Math.min(1, parallelFraction));
  if (cores <= 0) return 1.0;
  // S = 1 / ((1 - p) + (p / N))
  const speedup = 1 / (1 - p + p / cores);
  return Number(speedup.toFixed(2));
}

export function evaluateCpu(
  cpu: CpuProfile,
  refInstructionCountMillions: number = 1000
): CpuMetrics {
  let effectiveCpi = cpu.cpi ?? (cpu.ipc > 0 ? 1 / cpu.ipc : 1.0);
  
  if (cpu.instructionMix && cpu.instructionMix.length > 0) {
    effectiveCpi = calculateEffectiveCpi(cpu.instructionMix);
  }
  
  const effectiveIpc = Number((1 / effectiveCpi).toFixed(3));
  const clockHz = cpu.clockGhz * 1e9;
  
  // MIPS = Clock / (CPI * 10^6)
  const mips = Number((clockHz / (effectiveCpi * 1e6)).toFixed(1));

  // CPU Time = (Instructions * CPI) / ClockRate
  const instructions = refInstructionCountMillions * 1e6;
  const cpuTimeSeconds = Number(((instructions * effectiveCpi) / clockHz).toFixed(6));

  // AMAT
  const caches = cpu.caches || [
    { level: 'L1', sizeKB: 64, hitTimeCycles: 4, missRate: 0.05 },
    { level: 'L2', sizeKB: 512, hitTimeCycles: 12, missRate: 0.15 },
    { level: 'L3', sizeKB: 16384, hitTimeCycles: 40, missRate: 0.25 },
  ];
  const ramLatency = cpu.ramLatencyCycles || 150;
  const amatCycles = calculateAmat(caches, ramLatency);

  // Scores
  // Single-thread: Clock (GHz) * IPC * Cache factor
  const cachePenaltyFactor = Math.max(0.5, 1 - amatCycles / 500);
  const singleThreadScore = Number((cpu.clockGhz * effectiveIpc * 100).toFixed(1));
  
  // Multi-thread: Cores * (Clock * IPC) * parallel scaling factor
  const multiThreadScore = Number((singleThreadScore * Math.pow(cpu.cores, 0.85)).toFixed(1));
  
  // Overall composite score
  const overallScore = Number(((singleThreadScore * 0.4 + multiThreadScore * 0.6) * cachePenaltyFactor).toFixed(1));

  return {
    id: cpu.id,
    name: cpu.name,
    clockGhz: cpu.clockGhz,
    cores: cpu.cores,
    effectiveCpi,
    effectiveIpc,
    mips,
    cpuTimeSeconds,
    amatCycles,
    singleThreadScore,
    multiThreadScore,
    overallScore,
  };
}

export function compareCpus(
  cpus: CpuProfile[],
  baselineId?: string,
  refInstructionCountMillions: number = 1000
): CpuComparisonResult {
  if (cpus.length === 0) {
    throw new Error('At least one CPU must be provided for comparison.');
  }

  const evaluated = cpus.map((c) => evaluateCpu(c, refInstructionCountMillions));
  const activeBaselineId = baselineId || cpus[0].id;
  const baselineCpu = evaluated.find((c) => c.id === activeBaselineId) || evaluated[0];

  const speedups: { [cpuId: string]: number } = {};
  evaluated.forEach((c) => {
    // Speedup = Time_old / Time_new = Baseline_Time / Current_Time
    const ratio = baselineCpu.cpuTimeSeconds / c.cpuTimeSeconds;
    speedups[c.id] = Number(ratio.toFixed(2));
  });

  // Determine winners
  const stWinner = [...evaluated].sort((a, b) => b.singleThreadScore - a.singleThreadScore)[0];
  const mtWinner = [...evaluated].sort((a, b) => b.multiThreadScore - a.multiThreadScore)[0];
  const cacheWinner = [...evaluated].sort((a, b) => a.amatCycles - b.amatCycles)[0];
  const overallWinner = [...evaluated].sort((a, b) => b.overallScore - a.overallScore)[0];

  const steps = [
    {
      title: 'CPU Execution Time Formula',
      formula: 'CPU Time = (Instruction Count × CPI) / Clock Frequency',
      calculation: `For ${evaluated[0].name}: (${refInstructionCountMillions}M × ${evaluated[0].effectiveCpi}) / (${evaluated[0].clockGhz} GHz)`,
      result: `${evaluated[0].cpuTimeSeconds.toFixed(4)} seconds`,
    },
    {
      title: 'MIPS (Million Instructions Per Second)',
      formula: 'MIPS = Clock Frequency / (CPI × 10⁶) = Clock (MHz) / CPI',
      calculation: `${(evaluated[0].clockGhz * 1000).toFixed(0)} MHz / ${evaluated[0].effectiveCpi}`,
      result: `${evaluated[0].mips.toLocaleString()} MIPS`,
    },
    {
      title: 'Relative Speedup vs Baseline',
      formula: 'Speedup = Execution Time (Baseline) / Execution Time (Target)',
      calculation: `${baselineCpu.cpuTimeSeconds}s / ${evaluated[0].cpuTimeSeconds}s`,
      result: `${speedups[evaluated[0].id]}x`,
    },
    {
      title: 'Average Memory Access Time (AMAT)',
      formula: 'AMAT = Hit Time_L1 + Miss Rate_L1 × (Hit Time_L2 + Miss Rate_L2 × (...))',
      calculation: `Multi-level recursive cache evaluation down to main memory`,
      result: `${evaluated[0].amatCycles} cycles for ${evaluated[0].name}`,
    },
  ];

  return {
    cpus: evaluated,
    baselineId: baselineCpu.id,
    speedups,
    winners: {
      singleThread: stWinner.name,
      multiThread: mtWinner.name,
      cacheEfficiency: cacheWinner.name,
      overall: overallWinner.name,
    },
    steps,
  };
}
