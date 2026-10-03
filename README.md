# ⚡ ArchLab: Computer Architecture & Organization Toolkit

ArchLab is a multi-page, client-side web application built with **React**, **TypeScript**, and **Tailwind CSS**, styled in a **Bold Neobrutalism** aesthetic. It provides three engineering-grade interactive calculators based on core Computer Organization and Architecture (COA) principles.

---

## 🚀 Key Modules & Features

### 1. 💾 Memory Address Calculator
- **Capacity & Location Synthesis**: Computes addressable locations ($2^n$) and total capacity in both binary IEC units (KiB, MiB, GiB) and decimal SI units (KB, MB, GB).
- **Chip Expansion Design**:
  - **Horizontal Expansion**: Computes chip widening to meet processor data bus width: $M_H = \lceil W_{\text{word}} / W_{\text{chip\_width}} \rceil$.
  - **Vertical Expansion**: Computes depth banking to span address depth: $M_V = \lceil N_{\text{locations}} / N_{\text{chip\_locations}} \rceil$.
- **Hardware Decoder Architecture**: Automatically assigns address bus bits to internal chip offset lines ($A_{\text{offset}-1}..A_0$) and chip-select decoder lines ($A_{k-1}..A_{\text{offset}}$), designing $n\text{-to-}2^n$ decoders.
- **Visual Memory Map**: Stacked colored banks displaying precise hexadecimal (`0x0000 - 0x03FF`) and binary start/end ranges.
- **Reverse Mode**: Converts a desired memory capacity directly back into required address bus bits.
- **Edge-Case Warnings**: Highlights non-power-of-two chips, non-multiple word sizes, and partial decoding address mirrors.

### 2. ⚡ CPU / Laptop Spec Comparer
- **Classic CPU Performance Equation**:
  $$\text{CPU Time} = \frac{\text{Instruction Count} \times \text{CPI}}{\text{Clock Frequency}}$$
- **Dynamic Instruction Mix**: Computes weighted effective CPI from ALU, Load/Store, and Branch instruction classes:
  $$\text{CPI}_{\text{eff}} = \sum (\text{fraction}_i \times \text{CPI}_i)$$
- **Throughput & Speedup**: Calculates MIPS ($\frac{f}{\text{CPI} \times 10^6}$) and relative speedup relative to a user-selectable baseline CPU.
- **Amdahl's Law Scaling Slider**: Explores multicore speedup with configurable parallel fraction $p \in [0, 1]$:
  $$S(p, N) = \frac{1}{(1 - p) + \frac{p}{N}}$$
- **Multi-Level AMAT**: Recursive evaluation across L1, L2, L3 caches down to main memory:
  $$\text{AMAT} = t_{L1} + m_{L1} \times (t_{L2} + m_{L2} \times (t_{L3} + m_{L3} \times t_{\text{RAM}}))$$
- **Visual Comparisons**: Grouped Bar charts and Radar charts visualizing architectural balance across clock, cores, cache, and IPC. Winner badges for Single-Thread, Multi-Thread, and Cache Efficiency.

### 3. 🛠️ PC Build Helper
- **Theoretical Memory Bandwidth**:
  $$\text{Bandwidth (GB/s)} = \frac{\text{Transfer Rate (MT/s)} \times 64 \times N_{\text{channels}}}{8000}$$
- **Dual-Channel Diagnostics**: Alerts user if single-stick configurations cut theoretical bandwidth in half.
- **Bandwidth Per Core**: Calculates $\text{BW}_{\text{core}} = \frac{\text{Bandwidth}}{\text{Cores}}$ to identify memory-wall starvation.
- **Storage Latency & Load Time**: Simulates sequential transfer times for assets and benchmarks RAM-to-storage speed ratios.
- **Hardware Architecture Block Diagram**: Interactive Neobrutalist block diagram (CPU $\leftrightarrow$ Cache $\leftrightarrow$ RAM $\leftrightarrow$ Storage) with animated data-flow vectors whose thickness scales dynamically with interconnect bandwidth.
- **Rule-Based Bottleneck Diagnostics**: Workload-specific scoring (Gaming, Programming, Video Editing, AI/ML, Office) identifying the **Weakest Link** with plain-English optimization recommendations.
- **Build Comparison**: Save and compare up to 3 configurations in `localStorage`.

---

## 📦 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (with custom Neobrutalism design system: thick black borders, hard drop shadows, high contrast)
- **State Management**: Zustand with exception-safe `localStorage` persistence
- **Visualizations & Motion**: Recharts, Framer Motion, Lucide Icons
- **Testing**: Vitest unit test suite covering 100% of calculation formulas

---

## 🛠️ Getting Started & Local Development

### 1. Installation
```bash
cd "C:\Users\V CHETAN\.gemini\antigravity\scratch\archlab"
npm install
```

### 2. Run Vitest Unit Tests
```bash
npx vitest run
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production & Preview
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173/` to view the production build.

---

## 🔬 Unit Test Validation Summary
- **Memory Address Engine**: Validated 16-bit address space = 64 KiB, 32-bit = 4 GiB, decoder lines, and chip mapping.
- **CPU Spec Engine**: Validated instruction mix weighted CPI, Patterson & Hennessy AMAT multi-level calculation, Amdahl's Law parallel limits, and MIPS throughput.
- **PC Build Engine**: Validated DDR5-5600 Dual Channel = 89.6 GB/s, DDR4-3200 Single Channel = 25.6 GB/s, storage load simulation, and single-stick bottleneck warnings.
