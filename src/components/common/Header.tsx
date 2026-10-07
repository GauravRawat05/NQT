import React from 'react';
import { 
  BookOpen, 
  Code2, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Flower2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'aptitude' | 'coding' | 'hr';
  setActiveTab: (tab: 'aptitude' | 'coding' | 'hr') => void;
  aptitudeSolvedCount: number;
  codingSolvedCount: number;
  totalCodingCount: number;
  totalAptitudeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  aptitudeSolvedCount,
  codingSolvedCount,
  totalCodingCount,
  totalAptitudeCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EBE4DC] bg-[#FAF7F2]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Minimalist Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F4EBE1] border border-[#E8DACB] text-[#B86B77] shadow-sm">
              <Flower2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base tracking-tight text-[#2D2522]">
                  TCS NQT Prep
                </span>
                <span className="text-[10px] px-2 py-0.5 font-medium rounded-full bg-[#F4EFEA] text-[#786F6A] border border-[#E5DDD3]">
                  Ninja • Digital • Prime
                </span>
              </div>
              <p className="text-[11px] text-[#8C827A] font-normal tracking-wide">
                Minimalist Python & Aptitude Workspace
              </p>
            </div>
          </div>

          {/* Minimalist Navigation Pills */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-[#F3ECE4]/80 p-1 rounded-xl border border-[#E5DDD2]">
            <button
              onClick={() => setActiveTab('aptitude')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'aptitude'
                  ? 'bg-white text-[#2D2522] shadow-sm border border-[#E5DDD2]'
                  : 'text-[#786F6A] hover:text-[#2D2522] hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#588157]" />
              <span>Aptitude</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF7F2] text-[#786F6A] font-mono border border-[#EBE4DC]">
                {aptitudeSolvedCount}/{totalAptitudeCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coding')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'coding'
                  ? 'bg-white text-[#2D2522] shadow-sm border border-[#E5DDD2]'
                  : 'text-[#786F6A] hover:text-[#2D2522] hover:bg-white/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#B86B77]" />
              <span>Coding</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF7F2] text-[#786F6A] font-mono border border-[#EBE4DC]">
                {codingSolvedCount}/{totalCodingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hr')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'hr'
                  ? 'bg-white text-[#2D2522] shadow-sm border border-[#E5DDD2]'
                  : 'text-[#786F6A] hover:text-[#2D2522] hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#D97706]" />
              <span>HR Rounds</span>
            </button>
          </nav>

          {/* Minimal Metrics (Solved count & Python label) */}
          <div className="flex items-center space-x-2.5">
            <div className="hidden sm:flex items-center space-x-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#EBE4DC] shadow-sm">
              <div className="flex items-center space-x-1.5 text-[#588157] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved: {codingSolvedCount + aptitudeSolvedCount}</span>
              </div>
              <span className="text-[#D9CFC4]">•</span>
              <div className="flex items-center space-x-1 text-[#B86B77] font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Python Only</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
