import React from 'react';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t-4 border-black bg-zinc-900 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-mono font-black text-xl text-yellow-400">ArchLab_</div>
          <p className="text-xs text-zinc-400 mt-1 max-w-md">
            Interactive Computer Organization and Architecture (COA) learning & engineering toolkit.
            Designed with bold neobrutalism for maximum visual clarity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <NavLink to="/memory" className="hover:text-yellow-400 transition-colors">Memory</NavLink>
          <span className="text-zinc-600">•</span>
          <NavLink to="/cpu" className="hover:text-yellow-400 transition-colors">CPU Spec</NavLink>
          <span className="text-zinc-600">•</span>
          <NavLink to="/pc-build" className="hover:text-yellow-400 transition-colors">PC Build</NavLink>
          <span className="text-zinc-600">•</span>
          <NavLink to="/formulas" className="hover:text-yellow-400 transition-colors">Formulas</NavLink>
          <span className="text-zinc-600">•</span>
          <NavLink to="/about" className="hover:text-yellow-400 transition-colors">About</NavLink>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          © {new Date().getFullYear()} ArchLab Engine • No Backend Required
        </div>
      </div>
    </footer>
  );
};
