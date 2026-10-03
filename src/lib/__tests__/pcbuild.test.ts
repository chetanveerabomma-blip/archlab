import { describe, it, expect } from 'vitest';
import { calculateMemoryBandwidth, evaluatePcBuild } from '../pcbuild';
import type { PcBuildInputs } from '../pcbuild';

describe('PC Build Helper Engine', () => {
  it('calculates DDR5-5600 dual channel bandwidth as 89.6 GB/s', () => {
    // Known textbook specification:
    // (5600 MT/s * 64 bits * 2 channels) / 8000 = 89.6 GB/s
    const bw = calculateMemoryBandwidth(5600, 2);
    expect(bw).toBe(89.6);
  });

  it('calculates DDR4-3200 single channel bandwidth as 25.6 GB/s', () => {
    // (3200 MT/s * 64 bits * 1 channel) / 8000 = 25.6 GB/s
    const bw = calculateMemoryBandwidth(3200, 1);
    expect(bw).toBe(25.6);
  });

  it('identifies single channel memory bottlenecks and warns user', () => {
    const build: PcBuildInputs = {
      useCase: 'gaming',
      cpu: {
        name: 'Generic 8-Core',
        cores: 8,
        threads: 16,
        baseClockGhz: 3.5,
        boostClockGhz: 5.0,
        supportedChannels: 2,
      },
      ram: {
        type: 'DDR4',
        speedMts: 3200,
        capacityGb: 16,
        stickCount: 1, // Single stick!
        channelConfig: 'single',
      },
      storage: {
        type: 'NVME_GEN4',
        capacityGb: 1000,
        readSpeedMBs: 5000,
      },
    };

    const res = evaluatePcBuild(build);
    expect(res.isDualChannelActive).toBe(false);
    expect(res.channelWarning).toContain('Single stick detected');
    expect(res.recommendations.some(r => r.includes('Dual-Channel'))).toBe(true);
    expect(res.weakestLink).toBe('RAM Bandwidth');
  });

  it('computes storage load time and bandwidth ratio correctly', () => {
    const build: PcBuildInputs = {
      useCase: 'programming',
      cpu: {
        name: 'Hexa-Core CPU',
        cores: 6,
        threads: 12,
        baseClockGhz: 3.0,
        boostClockGhz: 4.5,
        supportedChannels: 2,
      },
      ram: {
        type: 'DDR5',
        speedMts: 6000,
        capacityGb: 32,
        stickCount: 2,
        channelConfig: 'dual',
      },
      storage: {
        type: 'SATA_SSD',
        capacityGb: 500,
        readSpeedMBs: 500, // 0.5 GB/s
      },
      testFileSizeGb: 20,
    };

    const res = evaluatePcBuild(build);
    // 20 GB / 0.5 GB/s = 40 seconds
    expect(res.storageLoadTimeSeconds).toBe(40);
    // RAM BW = (6000 * 8 * 2) / 1000 = 96 GB/s
    // 96 / 0.5 = 192x
    expect(res.ramToStorageBandwidthRatio).toBe(192);
  });
});
