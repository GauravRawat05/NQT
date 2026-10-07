import React, { useState, useMemo } from 'react';
import { CodingProblem, Difficulty } from '../../types/coding';
import { ProblemCard } from './ProblemCard';
import { ProblemDetailModal } from './ProblemDetailModal';
import { 
  Code2, 
  Search, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Zap,
  Layers,
  Flame
} from 'lucide-react';
import rawCodingData from '../../data/coding.json';

interface CodingSectionProps {
  solvedIds: Record<string, boolean>;
  onToggleSolved: (id: string) => void;
  bookmarkedIds: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
}

export const CodingSection: React.FC<CodingSectionProps> = ({
  solvedIds,
  onToggleSolved,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const allProblems = rawCodingData as CodingProblem[];

  const [activeTier, setActiveTier] = useState<Difficulty>('Easy');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [showSolvedOnly, setShowSolvedOnly] = useState<boolean>(false);
  const [activeProblem, setActiveProblem] = useState<CodingProblem | null>(null);

  const easyCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Easy').length, [allProblems]);
  const medCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Medium').length, [allProblems]);
  const hardCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Hard').length, [allProblems]);

  const easySolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Easy' && solvedIds[p.id]).length, [allProblems, solvedIds]);
  const medSolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Medium' && solvedIds[p.id]).length, [allProblems, solvedIds]);
  const hardSolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Hard' && solvedIds[p.id]).length, [allProblems, solvedIds]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    allProblems.forEach(p => {
      p.tags.forEach(t => {
        if (!t.toLowerCase().includes('pattern') && !t.toLowerCase().includes('pyq')) {
          set.add(t);
        }
      });
    });
    return Array.from(set).sort();
  }, [allProblems]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      if (p.difficulty !== activeTier) return false;
      if (selectedTag !== 'all' && !p.tags.includes(selectedTag)) return false;
      if (showBookmarksOnly && !bookmarkedIds[p.id]) return false;
      if (showSolvedOnly && !solvedIds[p.id]) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [allProblems, activeTier, selectedTag, showBookmarksOnly, showSolvedOnly, searchQuery, bookmarkedIds, solvedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#EBE4DC] shadow-sm">
        <div>
          <div className="flex items-center space-x-1.5 text-[#B86B77] font-semibold text-xs tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Python Solutions & Approaches</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2D2522] tracking-tight">
            TCS NQT Coding Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#786F6A] mt-1 max-w-xl font-normal leading-relaxed">
            Strictly Python 3 with algorithmic approach intuition, complexity breakdowns, and verified solutions.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center space-x-2 bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#EBE4DC] self-start md:self-auto">
          <div className="text-center px-3">
            <div className="text-[11px] text-[#166534] font-semibold">Easy</div>
            <div className="text-sm font-bold text-[#2D2522]">{easySolved}/{easyCount}</div>
          </div>
          <div className="w-px h-6 bg-[#EBE4DC]" />
          <div className="text-center px-3">
            <div className="text-[11px] text-[#92400E] font-semibold">Medium</div>
            <div className="text-sm font-bold text-[#2D2522]">{medSolved}/{medCount}</div>
          </div>
          <div className="w-px h-6 bg-[#EBE4DC]" />
          <div className="text-center px-3">
            <div className="text-[11px] text-[#9F1239] font-semibold">Hard</div>
            <div className="text-sm font-bold text-[#2D2522]">{hardSolved}/{hardCount}</div>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons (Easy, Medium, Hard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* EASY TIER */}
        <button
          onClick={() => setActiveTier('Easy')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left duration-200 ${
            activeTier === 'Easy'
              ? 'bg-white border-[#86EFAC] ring-1 ring-[#86EFAC] shadow-sm'
              : 'bg-white/70 border-[#EBE4DC] hover:border-[#D9CFC4] hover:bg-white text-[#786F6A]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTier === 'Easy' ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]' : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A]'
            }`}>
              <Zap className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-sm font-semibold ${activeTier === 'Easy' ? 'text-[#2D2522]' : 'text-[#4A423D]'}`}>
                  Easy Tier
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                  Ninja
                </span>
              </div>
              <p className="text-[11px] text-[#8C827A] mt-0.5">Foundational number theory & arrays</p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-[#4A423D] border border-[#EBE4DC]">
            {easyCount} Qs
          </span>
        </button>

        {/* MEDIUM TIER */}
        <button
          onClick={() => setActiveTier('Medium')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left duration-200 ${
            activeTier === 'Medium'
              ? 'bg-white border-[#FDE68A] ring-1 ring-[#FDE68A] shadow-sm'
              : 'bg-white/70 border-[#EBE4DC] hover:border-[#D9CFC4] hover:bg-white text-[#786F6A]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTier === 'Medium' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A]'
            }`}>
              <Layers className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-sm font-semibold ${activeTier === 'Medium' ? 'text-[#2D2522]' : 'text-[#4A423D]'}`}>
                  Medium Tier
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                  Digital
                </span>
              </div>
              <p className="text-[11px] text-[#8C827A] mt-0.5">Sliding window, matrices & hashing</p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-[#4A423D] border border-[#EBE4DC]">
            {medCount} Qs
          </span>
        </button>

        {/* HARD TIER */}
        <button
          onClick={() => setActiveTier('Hard')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left duration-200 ${
            activeTier === 'Hard'
              ? 'bg-white border-[#FECDD3] ring-1 ring-[#FECDD3] shadow-sm'
              : 'bg-white/70 border-[#EBE4DC] hover:border-[#D9CFC4] hover:bg-white text-[#786F6A]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              activeTier === 'Hard' ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]' : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A]'
            }`}>
              <Flame className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-sm font-semibold ${activeTier === 'Hard' ? 'text-[#2D2522]' : 'text-[#4A423D]'}`}>
                  Hard Tier
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3]">
                  Prime
                </span>
              </div>
              <p className="text-[11px] text-[#8C827A] mt-0.5">Dynamic programming & backtracking</p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-[#4A423D] border border-[#EBE4DC]">
            {hardCount} Qs
          </span>
        </button>

      </div>

      {/* Filter & Topic Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89F98]" />
            <input
              type="text"
              placeholder="Search problem title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] focus:border-[#C4B7A6] focus:outline-none text-xs text-[#2D2522] placeholder:text-[#A89F98]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowSolvedOnly(!showSolvedOnly)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-xl border text-xs font-medium transition-colors ${
                showSolvedOnly
                  ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]'
                  : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </button>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-xl border text-xs font-medium transition-colors ${
                showBookmarksOnly
                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                  : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked</span>
            </button>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap gap-1 pt-2 border-t border-[#EBE4DC]">
          <button
            onClick={() => setSelectedTag('all')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedTag === 'all'
                ? 'bg-[#2D2522] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#786F6A] hover:text-[#2D2522] border border-[#EBE4DC]'
            }`}
          >
            All Topics
          </button>
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                selectedTag === t
                  ? 'bg-[#2D2522] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#786F6A] hover:text-[#2D2522] border border-[#EBE4DC]'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-3.5">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE4DC] text-[#786F6A]">
            <p className="text-sm font-semibold text-[#2D2522]">No problems found</p>
            <p className="text-xs text-[#A89F98] mt-1">Try relaxing your search terms or filters.</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isSolved={!!solvedIds[problem.id]}
              isBookmarked={!!bookmarkedIds[problem.id]}
              onToggleSolved={onToggleSolved}
              onToggleBookmark={onToggleBookmark}
              onOpenDetails={(p) => setActiveProblem(p)}
            />
          ))
        )}
      </div>

      {/* Dedicated Problem Detail & Solution Modal */}
      {activeProblem && (
        <ProblemDetailModal
          problem={activeProblem}
          isSolved={!!solvedIds[activeProblem.id]}
          isBookmarked={!!bookmarkedIds[activeProblem.id]}
          onClose={() => setActiveProblem(null)}
          onToggleSolved={onToggleSolved}
          onToggleBookmark={onToggleBookmark}
        />
      )}

    </div>
  );
};
