import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { AptitudeSection } from './components/aptitude/AptitudeSection';
import { CodingSection } from './components/coding/CodingSection';
import { HRSection } from './components/hr/HRSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import aptitudeData from './data/aptitude.json';
import codingData from './data/coding.json';
import { ShieldCheck, Flower2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aptitude' | 'coding' | 'hr'>('coding');

  // Persistence hooks for Aptitude
  const [solvedAptitude, setSolvedAptitude] = useLocalStorage<Record<string, boolean>>('tcs_solved_aptitude', {});
  const [bookmarkedAptitude, setBookmarkedAptitude] = useLocalStorage<Record<string, boolean>>('tcs_bookmarked_aptitude', {});

  // Persistence hooks for Coding
  const [solvedCoding, setSolvedCoding] = useLocalStorage<Record<string, boolean>>('tcs_solved_coding', {});
  const [bookmarkedCoding, setBookmarkedCoding] = useLocalStorage<Record<string, boolean>>('tcs_bookmarked_coding', {});

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

  const aptitudeSolvedCount = Object.values(solvedAptitude).filter(Boolean).length;
  const codingSolvedCount = Object.values(solvedCoding).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2522] selection:bg-[#F3D5D8] selection:text-[#5E262B] transition-colors duration-200">
      
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          />
        )}

        {activeTab === 'hr' && (
          <HRSection />
        )}
      </main>

      {/* Minimal Floral Footer */}
      <footer className="border-t border-[#EBE4DC] bg-white text-[#786F6A] py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#2D2522] flex items-center space-x-1.5">
              <Flower2 className="w-3.5 h-3.5 text-[#B86B77]" />
              <span>TCS NQT Prep Master</span>
            </span>
            <span>•</span>
            <span>Python Solutions & Approaches</span>
            <span>•</span>
            <span className="text-[#588157] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </span>
          </div>

          <div className="text-[#8C827A]">
            Minimal Floral Light Edition • 1,023 Aptitude Qs • 154 Python Coding Problems • 50 HR Qs
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
