import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  Code2, 
  Users, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'aptitude' | 'coding' | 'hr';
  setActiveTab: (tab: 'aptitude' | 'coding' | 'hr') => void;
  isDark: boolean;
  toggleTheme: () => void;
  aptitudeSolvedCount: number;
  codingSolvedCount: number;
  totalCodingCount: number;
  totalAptitudeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  aptitudeSolvedCount,
  codingSolvedCount,
  totalCodingCount,
  totalAptitudeCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-slate-900/90 border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  TCS NQT
                </span>
                <span className="text-xs px-2 py-0.5 font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ninja • Digital • Prime
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Past Year Questions & Python Practice Engine</p>
            </div>
          </div>

          {/* Navigation Modules */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('aptitude')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'aptitude'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Aptitude & Logic</span>
              <span className="hidden md:inline-block ml-1 text-xs px-1.5 py-0.2 rounded bg-white/10 text-slate-200 font-mono">
                {aptitudeSolvedCount}/{totalAptitudeCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coding')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'coding'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Coding Workspace</span>
              <span className="hidden md:inline-block ml-1 text-xs px-1.5 py-0.2 rounded bg-white/10 text-slate-200 font-mono">
                {codingSolvedCount}/{totalCodingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hr')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'hr'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>HR & Interview</span>
            </button>
          </nav>

          {/* Quick Metrics & Theme Switch */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <div className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved: {codingSolvedCount + aptitudeSolvedCount}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center space-x-1 text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>Python Only</span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700/50"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
