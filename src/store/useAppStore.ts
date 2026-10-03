import { create } from 'zustand';
import { safeLocalStorageGet, safeLocalStorageSet } from '../lib/utils';
import type { MemoryInputs } from '../lib/memory';
import type { CpuProfile } from '../lib/cpu';
import type { PcBuildInputs } from '../lib/pcbuild';
import { EXAMPLE_CPUS } from '../data/presets';

interface SavedBuild {
  id: string;
  name: string;
  timestamp: string;
  inputs: PcBuildInputs;
}

interface AppStoreState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Memory State
  memoryInputs: MemoryInputs;
  setMemoryInputs: (inputs: Partial<MemoryInputs>) => void;
  
  // CPU State
  selectedCpus: CpuProfile[];
  baselineCpuId: string;
  setBaselineCpuId: (id: string) => void;
  updateCpu: (index: number, cpu: CpuProfile) => void;
  addCpu: (cpu: CpuProfile) => void;
  removeCpu: (id: string) => void;

  // PC Build State
  savedBuilds: SavedBuild[];
  saveBuild: (name: string, inputs: PcBuildInputs) => void;
  deleteBuild: (id: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  theme: safeLocalStorageGet<'light' | 'dark'>('archlab_theme', 'light'),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      safeLocalStorageSet('archlab_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: nextTheme };
    }),

  // Memory Defaults (16-bit address, 8-bit data, 1K x 8 chips)
  memoryInputs: safeLocalStorageGet<MemoryInputs>('archlab_memory', {
    addressBusWidth: 16,
    dataBusWidth: 8,
    addressability: 'byte',
    chipLocations: 1024,
    chipWordWidth: 8,
    startAddressHex: '0x0000',
  }),
  setMemoryInputs: (inputs) =>
    set((state) => {
      const updated = { ...state.memoryInputs, ...inputs };
      safeLocalStorageSet('archlab_memory', updated);
      return { memoryInputs: updated };
    }),

  // CPU Defaults
  selectedCpus: safeLocalStorageGet<CpuProfile[]>('archlab_cpus', [
    EXAMPLE_CPUS[0],
    EXAMPLE_CPUS[1],
  ]),
  baselineCpuId: EXAMPLE_CPUS[0].id,
  setBaselineCpuId: (id) => set({ baselineCpuId: id }),
  updateCpu: (index, cpu) =>
    set((state) => {
      const updated = [...state.selectedCpus];
      updated[index] = cpu;
      safeLocalStorageSet('archlab_cpus', updated);
      return { selectedCpus: updated };
    }),
  addCpu: (cpu) =>
    set((state) => {
      if (state.selectedCpus.length >= 4) return state;
      const updated = [...state.selectedCpus, cpu];
      safeLocalStorageSet('archlab_cpus', updated);
      return { selectedCpus: updated };
    }),
  removeCpu: (id) =>
    set((state) => {
      if (state.selectedCpus.length <= 1) return state;
      const updated = state.selectedCpus.filter((c) => c.id !== id);
      safeLocalStorageSet('archlab_cpus', updated);
      return {
        selectedCpus: updated,
        baselineCpuId: state.baselineCpuId === id ? updated[0].id : state.baselineCpuId,
      };
    }),

  // Saved Builds
  savedBuilds: safeLocalStorageGet<SavedBuild[]>('archlab_saved_builds', []),
  saveBuild: (name, inputs) =>
    set((state) => {
      const newBuild: SavedBuild = {
        id: 'build-' + Date.now(),
        name,
        timestamp: new Date().toLocaleDateString(),
        inputs,
      };
      const updated = [newBuild, ...state.savedBuilds.slice(0, 2)]; // store max 3
      safeLocalStorageSet('archlab_saved_builds', updated);
      return { savedBuilds: updated };
    }),
  deleteBuild: (id) =>
    set((state) => {
      const updated = state.savedBuilds.filter((b) => b.id !== id);
      safeLocalStorageSet('archlab_saved_builds', updated);
      return { savedBuilds: updated };
    }),
}));
