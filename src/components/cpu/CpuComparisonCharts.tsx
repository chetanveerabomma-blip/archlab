import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import type { CpuMetrics } from '../../lib/cpu';

interface CpuComparisonChartsProps {
  metrics: CpuMetrics[];
}

export const CpuComparisonCharts: React.FC<CpuComparisonChartsProps> = ({ metrics }) => {
  // Data for grouped performance bar chart
  const barData = metrics.map((m) => ({
    name: m.name.split(' ')[0], // short name
    MIPS: m.mips,
    'Single-Thread': m.singleThreadScore,
    'Multi-Thread': m.multiThreadScore,
    'Overall Score': m.overallScore,
  }));

  // Data for Radar Chart (normalized 0-100 for visual symmetry)
  // Max across current selection
  const maxClock = Math.max(...metrics.map((m) => m.clockGhz), 1);
  const maxCores = Math.max(...metrics.map((m) => m.cores), 1);
  const maxIpc = Math.max(...metrics.map((m) => m.effectiveIpc), 1);
  const minAmat = Math.min(...metrics.map((m) => m.amatCycles), 1);

  const radarMetrics = [
    { subject: 'Clock Speed', key: 'clock' },
    { subject: 'Core Density', key: 'cores' },
    { subject: 'IPC Efficiency', key: 'ipc' },
    { subject: 'Memory/AMAT Speed', key: 'amat' },
    { subject: 'MIPS Throughput', key: 'mips' },
  ];

  const maxMips = Math.max(...metrics.map((m) => m.mips), 1);

  const radarData = radarMetrics.map(({ subject, key }) => {
    const point: any = { subject };
    metrics.forEach((m, idx) => {
      let val = 50;
      if (key === 'clock') val = (m.clockGhz / maxClock) * 100;
      if (key === 'cores') val = (m.cores / maxCores) * 100;
      if (key === 'ipc') val = (m.effectiveIpc / maxIpc) * 100;
      if (key === 'amat') val = (minAmat / Math.max(m.amatCycles, 0.1)) * 100;
      if (key === 'mips') val = (m.mips / maxMips) * 100;
      point[`cpu_${idx}`] = Math.round(val);
    });
    return point;
  });

  const chartColors = ['#facc15', '#22d3ee', '#fb7185', '#a3e635'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Grouped Bar Chart */}
      <div className="p-4 border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
        <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-zinc-900 dark:text-zinc-100">
          Throughput & Score Breakdown (MIPS & Workloads)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid black',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  boxShadow: '3px 3px 0px black',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Bar dataKey="Single-Thread" fill="#facc15" stroke="#000" strokeWidth={1.5} />
              <Bar dataKey="Multi-Thread" fill="#22d3ee" stroke="#000" strokeWidth={1.5} />
              <Bar dataKey="Overall Score" fill="#fb7185" stroke="#000" strokeWidth={1.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-4 border-3 border-black bg-white dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#facc15]">
        <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-zinc-900 dark:text-zinc-100">
          Architectural Balance Radar (Normalized %)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#666" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              {metrics.map((m, idx) => (
                <Radar
                  key={m.id}
                  name={m.name.split(' ')[0]}
                  dataKey={`cpu_${idx}`}
                  stroke="#000000"
                  fill={chartColors[idx % chartColors.length]}
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid black',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
