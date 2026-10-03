import type { CpuProfile } from '../lib/cpu';
import type { CpuBuildSpec, RamSpec, StorageSpec, GpuSpec } from '../lib/pcbuild';

export const EXAMPLE_CPUS: CpuProfile[] = [
  {
    id: 'cpu-modern-flagship',
    name: 'Flagship 16-Core (Example Spec)',
    clockGhz: 4.5,
    cores: 16,
    threads: 32,
    ipc: 1.45,
    cpi: 0.69,
    instructionCountMillions: 1000,
    caches: [
      { level: 'L1', sizeKB: 64, hitTimeCycles: 4, missRate: 0.04 },
      { level: 'L2', sizeKB: 1024, hitTimeCycles: 14, missRate: 0.12 },
      { level: 'L3', sizeKB: 32768, hitTimeCycles: 45, missRate: 0.20 },
    ],
    ramLatencyCycles: 140,
    instructionMix: [
      { name: 'ALU Operations', percentage: 45, cpi: 1.0 },
      { name: 'Data Load/Store', percentage: 35, cpi: 1.4 },
      { name: 'Branch/Jumps', percentage: 20, cpi: 2.2 },
    ],
  },
  {
    id: 'cpu-midrange-workhorse',
    name: 'Midrange 8-Core (Example Spec)',
    clockGhz: 3.8,
    cores: 8,
    threads: 16,
    ipc: 1.25,
    cpi: 0.80,
    instructionCountMillions: 1000,
    caches: [
      { level: 'L1', sizeKB: 64, hitTimeCycles: 4, missRate: 0.05 },
      { level: 'L2', sizeKB: 512, hitTimeCycles: 12, missRate: 0.15 },
      { level: 'L3', sizeKB: 16384, hitTimeCycles: 40, missRate: 0.25 },
    ],
    ramLatencyCycles: 150,
    instructionMix: [
      { name: 'ALU Operations', percentage: 40, cpi: 1.0 },
      { name: 'Data Load/Store', percentage: 40, cpi: 1.6 },
      { name: 'Branch/Jumps', percentage: 20, cpi: 2.5 },
    ],
  },
  {
    id: 'cpu-budget-quad',
    name: 'Budget 4-Core (Example Spec)',
    clockGhz: 3.2,
    cores: 4,
    threads: 8,
    ipc: 1.0,
    cpi: 1.0,
    instructionCountMillions: 1000,
    caches: [
      { level: 'L1', sizeKB: 32, hitTimeCycles: 4, missRate: 0.08 },
      { level: 'L2', sizeKB: 256, hitTimeCycles: 10, missRate: 0.20 },
      { level: 'L3', sizeKB: 8192, hitTimeCycles: 35, missRate: 0.35 },
    ],
    ramLatencyCycles: 160,
    instructionMix: [
      { name: 'ALU Operations', percentage: 40, cpi: 1.2 },
      { name: 'Data Load/Store', percentage: 40, cpi: 1.8 },
      { name: 'Branch/Jumps', percentage: 20, cpi: 2.8 },
    ],
  },
  {
    id: 'cpu-high-clock-special',
    name: 'High-Clock Gaming 6-Core (Example Spec)',
    clockGhz: 5.2,
    cores: 6,
    threads: 12,
    ipc: 1.40,
    cpi: 0.71,
    instructionCountMillions: 1000,
    caches: [
      { level: 'L1', sizeKB: 64, hitTimeCycles: 4, missRate: 0.04 },
      { level: 'L2', sizeKB: 1024, hitTimeCycles: 12, missRate: 0.12 },
      { level: 'L3', sizeKB: 32768, hitTimeCycles: 40, missRate: 0.18 },
    ],
    ramLatencyCycles: 130,
    instructionMix: [
      { name: 'ALU Operations', percentage: 50, cpi: 0.9 },
      { name: 'Data Load/Store', percentage: 30, cpi: 1.3 },
      { name: 'Branch/Jumps', percentage: 20, cpi: 2.0 },
    ],
  },
];

export const EXAMPLE_RAM_PRESETS: { label: string; spec: RamSpec }[] = [
  {
    label: 'DDR5-6000 32GB Dual Channel (2x16GB)',
    spec: { type: 'DDR5', speedMts: 6000, capacityGb: 32, stickCount: 2, channelConfig: 'dual' },
  },
  {
    label: 'DDR5-5600 32GB Dual Channel (2x16GB)',
    spec: { type: 'DDR5', speedMts: 5600, capacityGb: 32, stickCount: 2, channelConfig: 'dual' },
  },
  {
    label: 'DDR4-3200 16GB Dual Channel (2x8GB)',
    spec: { type: 'DDR4', speedMts: 3200, capacityGb: 16, stickCount: 2, channelConfig: 'dual' },
  },
  {
    label: 'DDR4-3200 16GB Single Channel (1x16GB) [Bottleneck Case]',
    spec: { type: 'DDR4', speedMts: 3200, capacityGb: 16, stickCount: 1, channelConfig: 'single' },
  },
  {
    label: 'DDR5-4800 64GB Quad Channel (4x16GB Workstation)',
    spec: { type: 'DDR5', speedMts: 4800, capacityGb: 64, stickCount: 4, channelConfig: 'quad' },
  },
];

export const EXAMPLE_STORAGE_PRESETS: { label: string; spec: StorageSpec }[] = [
  {
    label: 'PCIe Gen5 NVMe SSD (12,000 MB/s)',
    spec: { type: 'NVME_GEN5', capacityGb: 2000, readSpeedMBs: 12000 },
  },
  {
    label: 'PCIe Gen4 NVMe SSD (7,000 MB/s)',
    spec: { type: 'NVME_GEN4', capacityGb: 2000, readSpeedMBs: 7000 },
  },
  {
    label: 'PCIe Gen3 NVMe SSD (3,500 MB/s)',
    spec: { type: 'NVME_GEN3', capacityGb: 1000, readSpeedMBs: 3500 },
  },
  {
    label: 'SATA SSD (550 MB/s)',
    spec: { type: 'SATA_SSD', capacityGb: 500, readSpeedMBs: 550 },
  },
  {
    label: 'Mechanical HDD (150 MB/s) [Severe Bottleneck]',
    spec: { type: 'HDD', capacityGb: 2000, readSpeedMBs: 150 },
  },
];

export const EXAMPLE_CPU_BUILD_PRESETS: { label: string; spec: CpuBuildSpec }[] = [
  {
    label: 'High-End 16-Core / 32-Thread (5.4 GHz Boost)',
    spec: { name: 'High-End 16-Core', cores: 16, threads: 32, baseClockGhz: 3.4, boostClockGhz: 5.4, supportedChannels: 2 },
  },
  {
    label: 'Mainstream 8-Core / 16-Thread (5.0 GHz Boost)',
    spec: { name: 'Mainstream 8-Core', cores: 8, threads: 16, baseClockGhz: 3.8, boostClockGhz: 5.0, supportedChannels: 2 },
  },
  {
    label: 'Entry 6-Core / 12-Thread (4.4 GHz Boost)',
    spec: { name: 'Entry 6-Core', cores: 6, threads: 12, baseClockGhz: 3.5, boostClockGhz: 4.4, supportedChannels: 2 },
  },
];

export const EXAMPLE_GPU_PRESETS: { label: string; spec: GpuSpec }[] = [
  { label: 'High-End Enthusiast (24 GB VRAM)', spec: { name: 'Enthusiast GPU', vramGb: 24, tier: 'enthusiast' } },
  { label: 'Mid-Range Standard (12 GB VRAM)', spec: { name: 'Mid-Range GPU', vramGb: 12, tier: 'mid' } },
  { label: 'Budget Entry (6 GB VRAM)', spec: { name: 'Entry GPU', vramGb: 6, tier: 'entry' } },
];
