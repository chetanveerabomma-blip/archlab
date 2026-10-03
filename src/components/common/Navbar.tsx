import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, HardDrive, Wrench, BookOpen, Info, Moon, Sun, Home } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/memory', label: 'Memory Address', icon: HardDrive },
    { to: '/cpu', label: 'CPU Comparer', icon: Cpu },
    { to: '/pc-build', label: 'PC Build Helper', icon: Wrench },
    { to: '/formulas', label: 'Formulas & Theory', icon: BookOpen },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-yellow-400 dark:bg-yellow-500 border-b-4 border-black text-black">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-black text-yellow-400 border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#fff] group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span className="font-black text-2xl tracking-tighter uppercase font-mono">
              Arch<span className="bg-black text-white px-1 ml-0.5">Lab</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-black/80">
              Computer Architecture Toolkit
            </span>
          </div>
        </NavLink>

        {/* Navigation links */}
        <nav className="flex items-center flex-wrap gap-1.5 md:gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wide border-2 border-black transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-black text-yellow-400 shadow-[2px_2px_0px_0px_#fff]'
                    : 'bg-white hover:bg-amber-100 text-black shadow-[2px_2px_0px_0px_#000]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="p-1.5 md:p-2 bg-white text-black border-2 border-black neo-btn flex items-center justify-center ml-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
