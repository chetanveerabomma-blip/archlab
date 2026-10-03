import { describe, it, expect } from 'vitest';
import {
  calculateEffectiveCpi,
  calculateAmat,
  calculateAmdahlSpeedup,
  evaluateCpu,
  compareCpus,
} from '../cpu';
import type { CpuProfile } from '../cpu';

describe('CPU Spec Comparison Engine', () => {
  it('calculates weighted CPI from instruction mix', () => {
    // 40% ALU (CPI 1), 20% Branch (CPI 2), 40% Load/Store (CPI 4)
    // Weighted = 0.4*1 + 0.2*2 + 0.4*4 = 0.4 + 0.4 + 1.6 = 2.4
    const mix = [
      { name: 'ALU', percentage: 40, cpi: 1 },
      { name: 'Branch', percentage: 20, cpi: 2 },
      { name: 'LoadStore', percentage: 40, cpi: 4 },
    ];
    const cpi = calculateEffectiveCpi(mix);
    expect(cpi).toBe(2.4);
  });

  it('calculates multi-level AMAT accurately', () => {
    // L1: hit 4 cycles, miss 5%
    // L2: hit 12 cycles, miss 20%
    // RAM: 100 cycles
    // AMAT = 4 + 0.05 * (12 + 0.20 * 100) = 4 + 0.05 * (12 + 20) = 4 + 0.05 * 32 = 4 + 1.6 = 5.6 cycles
    const caches = [
      { level: 'L1', sizeKB: 64, hitTimeCycles: 4, missRate: 0.05 },
      { level: 'L2', sizeKB: 512, hitTimeCycles: 12, missRate: 0.20 },
    ];
    const amat = calculateAmat(caches, 100);
    expect(amat).toBe(5.6);
  });

  it('calculates Amdahl speedup with parallel fractions', () => {
    // 8 cores, 80% parallel fraction (p = 0.8)
    // Speedup = 1 / ((1 - 0.8) + 0.8 / 8) = 1 / (0.2 + 0.1) = 1 / 0.3 = 3.33x
    const speedup = calculateAmdahlSpeedup(0.8, 8);
    expect(speedup).toBe(3.33);

    // 100% parallel -> 8x
    expect(calculateAmdahlSpeedup(1.0, 8)).toBe(8);
  });

  it('calculates MIPS and CPU execution time', () => {
    // 3.0 GHz, CPI 1.5 -> MIPS = 3000 / 1.5 = 2000 MIPS
    const cpu: CpuProfile = {
      id: 'cpu-a',
      name: 'Sample CPU',
      clockGhz: 3.0,
      cores: 4,
      threads: 8,
      ipc: 1 / 1.5,
      cpi: 1.5,
    };
    const metrics = evaluateCpu(cpu, 1000); // 1000 Million instructions
    expect(metrics.mips).toBe(2000);
    // Time = (1000e6 * 1.5) / 3.0e9 = 1500 / 3000 = 0.5s
    expect(metrics.cpuTimeSeconds).toBe(0.5);
  });

  it('correctly compares multiple CPUs and calculates relative speedups', () => {
    const cpus: CpuProfile[] = [
      { id: '1', name: 'CPU 1 (Baseline)', clockGhz: 2.0, cores: 4, threads: 4, ipc: 1.0 },
      { id: '2', name: 'CPU 2', clockGhz: 4.0, cores: 4, threads: 4, ipc: 1.0 },
    ];
    const res = compareCpus(cpus, '1', 1000);
    expect(res.speedups['1']).toBe(1);
    expect(res.speedups['2']).toBe(2); // 2x faster
    expect(res.winners.singleThread).toBe('CPU 2');
  });
});
