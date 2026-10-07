import React, { useState, useMemo } from 'react';
import { CodingProblem, Difficulty } from '../../types/coding';
import { ProblemCard } from './ProblemCard';
import { PracticeModal } from './PracticeModal';
import { 
  Code2, 
  Search, 
  Filter, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Trophy,
  Layers,
  Zap,
  Flame
} from 'lucide-react';
import rawCodingData from '../../data/coding.json';

interface CodingSectionProps {
  solvedIds: Record<string, boolean>;
  onToggleSolved: (id: string) => void;
  bookmarkedIds: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
  codeDrafts: Record<string, string>;
  onSaveDraft: (id: string, code: string) => void;
}

export const CodingSection: React.FC<CodingSectionProps> = ({
  solvedIds,
  onToggleSolved,
  bookmarkedIds,
  onToggleBookmark,
  codeDrafts,
  onSaveDraft
}) => {
  const allProblems = rawCodingData as CodingProblem[];

  const [activeTier, setActiveTier] = useState<Difficulty>('Easy');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [showSolvedOnly, setShowSolvedOnly] = useState<boolean>(false);
  const [activePracticeProblem, setActivePracticeProblem] = useState<CodingProblem | null>(null);

  // Difficulty counts
  const easyCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Easy').length, [allProblems]);
  const medCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Medium').length, [allProblems]);
  const hardCount = useMemo(() => allProblems.filter(p => p.difficulty === 'Hard').length, [allProblems]);

  const easySolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Easy' && solvedIds[p.id]).length, [allProblems, solvedIds]);
  const medSolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Medium' && solvedIds[p.id]).length, [allProblems, solvedIds]);
  const hardSolved = useMemo(() => allProblems.filter(p => p.difficulty === 'Hard' && solvedIds[p.id]).length, [allProblems, solvedIds]);

  // Topic tags extracted from problems
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

  // Filtered problems list
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Python-Only DSA & PYQ Practice Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            TCS NQT Coding Practice
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Strictly Python 3 implementations with step-by-step algorithmic approaches, time/space complexity analysis, and in-browser WebAssembly execution.
          </p>
        </div>

        {/* Quick Metrics Cards */}
        <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="text-center px-3">
            <div className="text-xs text-emerald-400 font-bold">Easy</div>
            <div className="text-sm font-extrabold text-white">{easySolved}/{easyCount}</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-3">
            <div className="text-xs text-amber-400 font-bold">Medium</div>
            <div className="text-sm font-extrabold text-white">{medSolved}/{medCount}</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-3">
            <div className="text-xs text-rose-400 font-bold">Hard</div>
            <div className="text-sm font-extrabold text-white">{hardSolved}/{hardCount}</div>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons (Easy, Medium, Hard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* EASY TIER */}
        <button
          onClick={() => setActiveTier('Easy')}
          className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
            activeTier === 'Easy'
              ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-xl ${activeTier === 'Easy' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-base font-bold ${activeTier === 'Easy' ? 'text-white' : 'text-slate-300'}`}>
                  Easy Tier
                </span>
                <span className="text-[11px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Ninja / Foundation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Foundational number theory, arrays & basic logic</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
            {easyCount} Qs
          </span>
        </button>

        {/* MEDIUM TIER */}
        <button
          onClick={() => setActiveTier('Medium')}
          className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
            activeTier === 'Medium'
              ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-xl ${activeTier === 'Medium' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-base font-bold ${activeTier === 'Medium' ? 'text-white' : 'text-slate-300'}`}>
                  Medium Tier
                </span>
                <span className="text-[11px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Digital Upgrade
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Sliding window, hashing, two pointers, matrices</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
            {medCount} Qs
          </span>
        </button>

        {/* HARD TIER */}
        <button
          onClick={() => setActiveTier('Hard')}
          className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
            activeTier === 'Hard'
              ? 'bg-slate-900 border-rose-500 ring-1 ring-rose-500/50 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-xl ${activeTier === 'Hard' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-base font-bold ${activeTier === 'Hard' ? 'text-white' : 'text-slate-300'}`}>
                  Hard Tier
                </span>
                <span className="text-[11px] px-2 py-0.2 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Prime Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Dynamic programming, backtracking, optimal trees</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
            {hardCount} Qs
          </span>
        </button>

      </div>

      {/* Filter & Topic Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problem title, tag, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowSolvedOnly(!showSolvedOnly)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                showSolvedOnly
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved Only</span>
            </button>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                showBookmarksOnly
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked</span>
            </button>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedTag('all')}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Topics
          </button>
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedTag === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <p className="text-base font-semibold text-slate-300">No problems found</p>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filters.</p>
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
              onOpenPractice={(p) => setActivePracticeProblem(p)}
            />
          ))
        )}
      </div>

      {/* LeetCode Split Workspace Modal */}
      {activePracticeProblem && (
        <PracticeModal
          problem={activePracticeProblem}
          onClose={() => setActivePracticeProblem(null)}
          onMarkSolved={onToggleSolved}
          savedDraft={codeDrafts[activePracticeProblem.id]}
          onSaveDraft={onSaveDraft}
        />
      )}

    </div>
  );
};
