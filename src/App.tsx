import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { AptitudeSection } from './components/aptitude/AptitudeSection';
import { CodingSection } from './components/coding/CodingSection';
import { HRSection } from './components/hr/HRSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import aptitudeData from './data/aptitude.json';
import codingData from './data/coding.json';
import hrData from './data/hr.json';
import { Terminal, ShieldCheck, Heart, Sparkles, BookOpen, Code2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aptitude' | 'coding' | 'hr'>('coding');
  const [isDark, setIsDark] = useLocalStorage<boolean>('tcs_prep_dark_theme', true);

  // Persistence hooks for Aptitude
  const [solvedAptitude, setSolvedAptitude] = useLocalStorage<Record<string, boolean>>('tcs_solved_aptitude', {});
  const [bookmarkedAptitude, setBookmarkedAptitude] = useLocalStorage<Record<string, boolean>>('tcs_bookmarked_aptitude', {});

  // Persistence hooks for Coding
  const [solvedCoding, setSolvedCoding] = useLocalStorage<Record<string, boolean>>('tcs_solved_coding', {});
  const [bookmarkedCoding, setBookmarkedCoding] = useLocalStorage<Record<string, boolean>>('tcs_bookmarked_coding', {});
  const [codeDrafts, setCodeDrafts] = useLocalStorage<Record<string, string>>('tcs_code_drafts', {});

  // Theme effect on HTML document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleSolvedAptitude = (id: string) => {
    setSolvedAptitude(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmarkAptitude = (id: string) => {
    setBookmarkedAptitude(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSolvedCoding = (id: string) => {
    setSolvedCoding(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmarkCoding = (id: string) => {
    setBookmarkedCoding(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveDraft = (id: string, code: string) => {
    setCodeDrafts(prev => ({
      ...prev,
      [id]: code
    }));
  };

  const aptitudeSolvedCount = Object.values(solvedAptitude).filter(Boolean).length;
  const codingSolvedCount = Object.values(solvedCoding).filter(Boolean).length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        aptitudeSolvedCount={aptitudeSolvedCount}
        codingSolvedCount={codingSolvedCount}
        totalCodingCount={codingData.length}
        totalAptitudeCount={aptitudeData.length}
      />

      {/* Main Module Content */}
      <main className="pb-16">
        {activeTab === 'aptitude' && (
          <AptitudeSection
            solvedIds={solvedAptitude}
            onToggleSolved={toggleSolvedAptitude}
            bookmarkedIds={bookmarkedAptitude}
            onToggleBookmark={toggleBookmarkAptitude}
          />
        )}

        {activeTab === 'coding' && (
          <CodingSection
            solvedIds={solvedCoding}
            onToggleSolved={toggleSolvedCoding}
            bookmarkedIds={bookmarkedCoding}
            onToggleBookmark={toggleBookmarkCoding}
            codeDrafts={codeDrafts}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeTab === 'hr' && (
          <HRSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">TCS NQT Preparation Master</span>
            <span>•</span>
            <span>Python WebAssembly In-Browser Engine</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </span>
          </div>

          <div className="text-slate-500">
            Dedicated to Ninja, Digital & Prime Aspirants • 1,023 Aptitude Qs • 154 Coding Problems • 50 HR Qs
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
