import React, { useState, useMemo } from 'react';
import { AptitudeCategory, AptitudeQuestion, AptitudeMode } from '../../types/aptitude';
import { QuestionCard } from './QuestionCard';
import { MockTestView } from './MockTestView';
import { 
  Calculator, 
  BookA, 
  Brain, 
  Cpu, 
  Search, 
  Filter, 
  PlayCircle, 
  RotateCcw,
  Sparkles,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import rawAptitudeData from '../../data/aptitude.json';

interface AptitudeSectionProps {
  solvedIds: Record<string, boolean>;
  onToggleSolved: (id: string) => void;
  bookmarkedIds: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
}

export const AptitudeSection: React.FC<AptitudeSectionProps> = ({
  solvedIds,
  onToggleSolved,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AptitudeCategory>('numerical');
  const [mode, setMode] = useState<AptitudeMode>('practice');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const allQuestions = rawAptitudeData as AptitudeQuestion[];

  // Category Tabs metadata
  const categories: { id: AptitudeCategory; label: string; icon: any; count: number }[] = useMemo(() => [
    {
      id: 'numerical',
      label: 'Numerical Ability',
      icon: Calculator,
      count: allQuestions.filter(q => q.category === 'numerical').length
    },
    {
      id: 'verbal',
      label: 'Verbal Ability',
      icon: BookA,
      count: allQuestions.filter(q => q.category === 'verbal').length
    },
    {
      id: 'reasoning',
      label: 'Logical Reasoning',
      icon: Brain,
      count: allQuestions.filter(q => q.category === 'reasoning').length
    },
    {
      id: 'cs_logic',
      label: 'CS Fundamentals & Logic',
      icon: Cpu,
      count: allQuestions.filter(q => q.category === 'cs_logic').length
    }
  ], [allQuestions]);

  // Filtered Questions for Practice Mode
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (q.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (showBookmarksOnly && !bookmarkedIds[q.id]) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          q.subtopic.toLowerCase().includes(query) ||
          q.options.some(opt => opt.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [allQuestions, selectedCategory, selectedDifficulty, showBookmarksOnly, searchQuery, bookmarkedIds]);

  // Questions for Mock Test (Random sample of 25 questions from current category or balanced)
  const mockTestQuestions = useMemo(() => {
    const categoryQuestions = allQuestions.filter(q => q.category === selectedCategory);
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 25);
  }, [allQuestions, selectedCategory, mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>TCS NQT Foundation & Advanced Aptitude</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Aptitude & Technical Logic Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Over 1,000 deduplicated past-year questions across Numerical, Verbal, Reasoning, and Programming Logic with instant mathematical solutions.
          </p>
        </div>

        {/* Practice vs Timed Mock Test Toggle */}
        <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-700/80 self-start md:self-auto">
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'practice'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Practice Mode</span>
          </button>

          <button
            onClick={() => setMode('mock_test')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'mock_test'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Timed Mock Test (20m)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {mode === 'mock_test' ? (
        <MockTestView
          questions={mockTestQuestions}
          onExitMockTest={() => setMode('practice')}
        />
      ) : (
        <div className="space-y-6">
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(20);
                  }}
                  className={`flex items-center space-x-3.5 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {cat.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {cat.count} Questions
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Filters Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search question keywords or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {/* Difficulty Dropdown */}
              <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Levels</option>
                  <option value="Easy" className="bg-slate-900">Easy</option>
                  <option value="Medium" className="bg-slate-900">Medium</option>
                  <option value="Hard" className="bg-slate-900">Hard</option>
                </select>
              </div>

              {/* Bookmarks Toggle */}
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

          {/* Question Cards List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
                <p className="text-base font-semibold text-slate-300">No questions found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              filteredQuestions.slice(0, visibleCount).map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  isSolved={!!solvedIds[q.id]}
                  isBookmarked={!!bookmarkedIds[q.id]}
                  onToggleSolved={onToggleSolved}
                  onToggleBookmark={onToggleBookmark}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredQuestions.length > visibleCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 shadow-md transition-colors"
              >
                Load More Questions ({filteredQuestions.length - visibleCount} remaining)
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
