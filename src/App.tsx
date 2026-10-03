import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { MemoryCalculatorPage } from './pages/MemoryCalculatorPage';
import { CpuComparerPage } from './pages/CpuComparerPage';
import { PcBuildHelperPage } from './pages/PcBuildHelperPage';
import { FormulasTheoryPage } from './pages/FormulasTheoryPage';
import { AboutPage } from './pages/AboutPage';
import { useAppStore } from './store/useAppStore';

export const App: React.FC = () => {
  const { theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#fdfbf7] dark:bg-[#121217] text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/memory" element={<MemoryCalculatorPage />} />
            <Route path="/cpu" element={<CpuComparerPage />} />
            <Route path="/pc-build" element={<PcBuildHelperPage />} />
            <Route path="/formulas" element={<FormulasTheoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
