/**
 * ArchLab - Pure TypeScript PC Build Helper Engine
 * Calculates memory bandwidth, validates channel configs,
 * analyzes storage load times, and conducts rule-based bottleneck analysis.
 */

export type UseCase = 'gaming' | 'programming' | 'video_editing' | 'ai_ml' | 'office';

export interface RamSpec {
  type: 'DDR4' | 'DDR5';
  speedMts: number;       // e.g. 3200, 5600, 6000
  capacityGb: number;     // total capacity e.g. 16, 32, 64
  stickCount: number;     // 1, 2, 4
  channelConfig: 'single' | 'dual' | 'quad';
}

export interface StorageSpec {
  type: 'HDD' | 'SATA_SSD' | 'NVME_GEN3' | 'NVME_GEN4' | 'NVME_GEN5';
  capacityGb: number;
  readSpeedMBs: number;   // sequential read speed in MB/s
}

export interface CpuBuildSpec {
  name: string;
  cores: number;
  threads: number;
  baseClockGhz: number;
  boostClockGhz: number;
  supportedChannels: number; // usually 2 for consumer desktop, 4/8 for HEDT/server
}

export interface GpuSpec {
  name: string;
  vramGb: number;
  tier: 'entry' | 'mid' | 'high' | 'enthusiast';
}

export interface PcBuildInputs {
  useCase: UseCase;
  cpu: CpuBuildSpec;
  ram: RamSpec;
  storage: StorageSpec;
  gpu?: GpuSpec;
  testFileSizeGb?: number; // for load time test (default 25 GB)
}

export interface ComponentScore {
  name: string;
  score: number; // 0 to 100
  status: 'good' | 'warning' | 'critical';
  detail: string;
}

export interface PcBuildResult {
  memoryBandwidthGBs: number;
  bandwidthPerCoreGBs: number;
  isDualChannelActive: boolean;
  channelWarning?: string;
  storageLoadTimeSeconds: number;
  ramToStorageBandwidthRatio: number;
  componentScores: {
    cpu: ComponentScore;
    ramCapacity: ComponentScore;
    ramBandwidth: ComponentScore;
    storage: ComponentScore;
    gpu?: ComponentScore;
  };
  overallBalanceScore: number;
  weakestLink: string;
  recommendations: string[];
  steps: { title: string; formula: string; calculation: string; result: string }[];
}

/**
 * Theoretical memory bandwidth calculation:
 * Bandwidth = (MT/s * 64 bits/channel * channels) / (8 bits/byte * 1000) GB/s
 * Note: DDR5 uses two 32-bit subchannels per DIMM, but the overall bus width per standard channel is 64-bit equivalent.
 */
export function calculateMemoryBandwidth(
  speedMts: number,
  channels: number
): number {
  if (speedMts <= 0 || channels <= 0) return 0;
  // Bandwidth (GB/s) = (MT/s * 8 bytes * channels) / 1000
  // e.g. DDR5-5600 Dual Channel (2 ch) = (5600 * 8 * 2) / 1000 = 89.6 GB/s
  const bandwidthGBs = (speedMts * 8 * channels) / 1000;
  return Number(bandwidthGBs.toFixed(2));
}

export function evaluatePcBuild(inputs: PcBuildInputs): PcBuildResult {
  const { useCase, cpu, ram, storage, gpu, testFileSizeGb = 25 } = inputs;

  // Determine active channels
  let activeChannels = 1;
  let isDualChannelActive = false;
  let channelWarning: string | undefined = undefined;

  if (ram.stickCount === 1) {
    activeChannels = 1;
    channelWarning =
      'Single stick detected: Memory is operating in Single-Channel mode (cuts memory bandwidth in half!). Recommend 2 sticks.';
  } else if (ram.stickCount >= 2) {
    activeChannels = Math.min(cpu.supportedChannels, ram.stickCount >= 4 && cpu.supportedChannels >= 4 ? 4 : 2);
    isDualChannelActive = activeChannels >= 2;
  }

  const memoryBandwidthGBs = calculateMemoryBandwidth(ram.speedMts, activeChannels);
  const bandwidthPerCoreGBs = cpu.cores > 0 ? Number((memoryBandwidthGBs / cpu.cores).toFixed(2)) : 0;

  // Storage load time (sequential estimate)
  // readSpeedMBs in MB/s -> GB/s = readSpeedMBs / 1000
  const storageSpeedGBs = storage.readSpeedMBs / 1000;
  const storageLoadTimeSeconds = storageSpeedGBs > 0 ? Number((testFileSizeGb / storageSpeedGBs).toFixed(2)) : 0;

  const ramToStorageBandwidthRatio = storageSpeedGBs > 0 ? Number((memoryBandwidthGBs / storageSpeedGBs).toFixed(1)) : 0;

  // Heuristic Scoring by Use Case
  const recommendations: string[] = [];
  
  // 1. RAM Capacity Score
  let ramMin = 16;
  let ramTarget = 32;
  if (useCase === 'office') {
    ramMin = 8; ramTarget = 16;
  } else if (useCase === 'video_editing' || useCase === 'ai_ml') {
    ramMin = 32; ramTarget = 64;
  }
  
  let ramCapScore = 100;
  let ramCapStatus: 'good' | 'warning' | 'critical' = 'good';
  let ramCapDetail = `${ram.capacityGb} GB Installed`;

  if (ram.capacityGb < ramMin) {
    ramCapScore = 40;
    ramCapStatus = 'critical';
    ramCapDetail = `Low RAM for ${useCase.replace('_', ' ')} (Target: ${ramTarget} GB)`;
    recommendations.push(`Upgrade RAM to at least ${ramTarget} GB for smoother multitasking and paging prevention.`);
  } else if (ram.capacityGb < ramTarget) {
    ramCapScore = 75;
    ramCapStatus = 'warning';
    ramCapDetail = `Acceptable, but ${ramTarget} GB recommended for heavy loads`;
  }

  // 2. RAM Bandwidth Score
  let ramBwScore = isDualChannelActive ? 90 : 50;
  if (!isDualChannelActive) {
    recommendations.push('Add a second identical memory stick to enable Dual-Channel and double your memory bandwidth.');
  }
  if (ram.type === 'DDR5' && ram.speedMts >= 6000 && isDualChannelActive) {
    ramBwScore = 100;
  }
  const ramBwStatus = ramBwScore >= 80 ? 'good' : ramBwScore >= 60 ? 'warning' : 'critical';

  // 3. Storage Score
  let storageScore = 70;
  let storageStatus: 'good' | 'warning' | 'critical' = 'good';
  let storageDetail = `${storage.readSpeedMBs} MB/s sequential`;

  if (storage.type === 'HDD') {
    storageScore = 25;
    storageStatus = 'critical';
    storageDetail = 'Mechanical HDD will cause major system stalls';
    recommendations.push('Replace mechanical HDD with at least an NVMe SSD for system boot and primary workloads.');
  } else if (storage.type === 'SATA_SSD') {
    storageScore = 65;
    storageStatus = 'warning';
    storageDetail = 'SATA SSD (~550 MB/s) limits high throughput workloads';
    if (useCase === 'video_editing' || useCase === 'gaming') {
      recommendations.push('Upgrade to NVMe PCIe Gen4 SSD for fast asset loading.');
    }
  } else if (storage.type === 'NVME_GEN4' || storage.type === 'NVME_GEN5') {
    storageScore = 95;
  }

  // 4. CPU Score
  let cpuScore = 80;
  if (useCase === 'ai_ml' && cpu.cores < 8) {
    cpuScore = 60;
    recommendations.push('For AI/ML workflows, consider an 8+ core modern CPU with AVX-512 / AMX capabilities.');
  } else if (useCase === 'video_editing' && cpu.cores < 8) {
    cpuScore = 65;
    recommendations.push('Video rendering scales heavily with cores; 8 to 16 cores recommended.');
  }

  // 5. GPU Score (optional)
  let gpuScoreObj: ComponentScore | undefined = undefined;
  if (gpu) {
    let gScore = 80;
    if (useCase === 'gaming' || useCase === 'ai_ml') {
      if (gpu.vramGb < 8) {
        gScore = 45;
        recommendations.push(`VRAM (${gpu.vramGb} GB) is low for modern ${useCase === 'gaming' ? 'AAA games' : 'LLM/Diffusion models'}. 12GB+ recommended.`);
      } else if (gpu.vramGb >= 16) {
        gScore = 95;
      }
    }
    gpuScoreObj = {
      name: gpu.name,
      score: gScore,
      status: gScore >= 80 ? 'good' : gScore >= 60 ? 'warning' : 'critical',
      detail: `${gpu.vramGb} GB VRAM (${gpu.tier} tier)`,
    };
  }

  // Find weakest link
  const scores = [
    { name: 'RAM Bandwidth', score: ramBwScore },
    { name: 'RAM Capacity', score: ramCapScore },
    { name: 'Storage Speed', score: storageScore },
    { name: 'CPU Performance', score: cpuScore },
  ];
  if (gpuScoreObj) {
    scores.push({ name: 'GPU / VRAM', score: gpuScoreObj.score });
  }

  scores.sort((a, b) => a.score - b.score);
  const weakestLink = scores[0].name;

  // Overall Balance Score
  const totalScoreSum = scores.reduce((acc, curr) => acc + curr.score, 0);
  const overallBalanceScore = Math.round(totalScoreSum / scores.length);

  const steps = [
    {
      title: 'Theoretical Memory Bandwidth',
      formula: 'Bandwidth (GB/s) = (Transfer Rate MT/s × 64 bits × Channels) / (8 × 1000)',
      calculation: `(${ram.speedMts} MT/s × 64 × ${activeChannels}) / 8000`,
      result: `${memoryBandwidthGBs} GB/s`,
    },
    {
      title: 'Bandwidth Per CPU Core',
      formula: 'Bandwidth / Core = Memory Bandwidth / Number of Cores',
      calculation: `${memoryBandwidthGBs} GB/s / ${cpu.cores} cores`,
      result: `${bandwidthPerCoreGBs} GB/s per core`,
    },
    {
      title: 'Storage Load Time Simulation',
      formula: 'Time = File Size / Sequential Read Speed',
      calculation: `${testFileSizeGb} GB / ${(storage.readSpeedMBs / 1000).toFixed(2)} GB/s`,
      result: `${storageLoadTimeSeconds} seconds for ${testFileSizeGb} GB file`,
    },
    {
      title: 'Memory vs Storage Bandwidth Disparity',
      formula: 'Ratio = RAM Bandwidth / Storage Bandwidth',
      calculation: `${memoryBandwidthGBs} GB/s / ${(storage.readSpeedMBs / 1000).toFixed(2)} GB/s`,
      result: `RAM is ${ramToStorageBandwidthRatio}x faster than Storage`,
    },
  ];

  return {
    memoryBandwidthGBs,
    bandwidthPerCoreGBs,
    isDualChannelActive,
    channelWarning,
    storageLoadTimeSeconds,
    ramToStorageBandwidthRatio,
    componentScores: {
      cpu: {
        name: cpu.name,
        score: cpuScore,
        status: cpuScore >= 80 ? 'good' : cpuScore >= 60 ? 'warning' : 'critical',
        detail: `${cpu.cores} Cores / ${cpu.threads} Threads @ ${cpu.boostClockGhz} GHz Boost`,
      },
      ramCapacity: {
        name: 'RAM Capacity',
        score: ramCapScore,
        status: ramCapStatus,
        detail: ramCapDetail,
      },
      ramBandwidth: {
        name: 'RAM Bandwidth',
        score: ramBwScore,
        status: ramBwStatus,
        detail: `${memoryBandwidthGBs} GB/s (${activeChannels}-channel ${ram.type}-${ram.speedMts})`,
      },
      storage: {
        name: 'Storage Subsystem',
        score: storageScore,
        status: storageStatus,
        detail: storageDetail,
      },
      gpu: gpuScoreObj,
    },
    overallBalanceScore,
    weakestLink,
    recommendations,
    steps,
  };
}
