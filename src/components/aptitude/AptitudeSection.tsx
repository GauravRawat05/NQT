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

  const categories = useMemo(() => [
    {
      id: 'numerical' as AptitudeCategory,
      label: 'Numerical Ability',
      icon: Calculator,
      color: 'text-[#588157]',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      count: allQuestions.filter(q => q.category === 'numerical').length
    },
    {
      id: 'verbal' as AptitudeCategory,
      label: 'Verbal Ability',
      icon: BookA,
      color: 'text-[#B86B77]',
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#FECDD3]',
      count: allQuestions.filter(q => q.category === 'verbal').length
    },
    {
      id: 'reasoning' as AptitudeCategory,
      label: 'Logical Reasoning',
      icon: Brain,
      color: 'text-[#8B7EC8]',
      bg: 'bg-[#F5F3FF]',
      border: 'border-[#DDD6FE]',
      count: allQuestions.filter(q => q.category === 'reasoning').length
    },
    {
      id: 'cs_logic' as AptitudeCategory,
      label: 'CS Fundamentals & Logic',
      icon: Cpu,
      color: 'text-[#D97706]',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      count: allQuestions.filter(q => q.category === 'cs_logic').length
    }
  ], [allQuestions]);

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

  const mockTestQuestions = useMemo(() => {
    const categoryQuestions = allQuestions.filter(q => q.category === selectedCategory);
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 25);
  }, [allQuestions, selectedCategory, mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#EBE4DC] shadow-sm">
        <div>
          <div className="flex items-center space-x-1.5 text-[#B86B77] font-semibold text-xs tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Foundational & Advanced Questions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2D2522] tracking-tight">
            Aptitude & Technical Logic
          </h1>
          <p className="text-xs sm:text-sm text-[#786F6A] mt-1 max-w-xl font-normal leading-relaxed">
            1,023 verified and deduplicated questions across Quantitative, Verbal, Reasoning, and CS Logic.
          </p>
        </div>

        {/* Practice vs Timed Mode Switch */}
        <div className="flex items-center bg-[#F4EFEA] p-1 rounded-xl border border-[#E5DDD2] self-start md:self-auto">
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              mode === 'practice'
                ? 'bg-white text-[#2D2522] shadow-sm border border-[#E5DDD2]'
                : 'text-[#786F6A] hover:text-[#2D2522]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#588157]" />
            <span>Practice Mode</span>
          </button>

          <button
            onClick={() => setMode('mock_test')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              mode === 'mock_test'
                ? 'bg-white text-[#2D2522] shadow-sm border border-[#E5DDD2]'
                : 'text-[#786F6A] hover:text-[#2D2522]'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Timed Exam (20m)</span>
          </button>
        </div>
      </div>

      {mode === 'mock_test' ? (
        <MockTestView
          questions={mockTestQuestions}
          onExitMockTest={() => setMode('practice')}
        />
      ) : (
        <div className="space-y-5">
          
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
                  className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-white border-[#C4B7A6] shadow-sm ring-1 ring-[#C4B7A6]'
                      : 'bg-white/70 border-[#EBE4DC] hover:border-[#D9CFC4] hover:bg-white text-[#786F6A]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.border} border ${cat.color}`}>
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${isSelected ? 'text-[#2D2522]' : 'text-[#4A423D]'}`}>
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-[#8C827A] mt-0.5">
                      {cat.count} Questions
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89F98]" />
              <input
                type="text"
                placeholder="Search keywords or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] focus:border-[#C4B7A6] focus:outline-none text-xs text-[#2D2522] placeholder:text-[#A89F98]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <div className="flex items-center space-x-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#EBE4DC] text-xs">
                <Filter className="w-3.5 h-3.5 text-[#786F6A]" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-transparent text-[#4A423D] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-xl border text-xs font-medium transition-colors ${
                  showBookmarksOnly
                    ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                    : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522]'
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span>Bookmarked</span>
              </button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-3.5">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE4DC] text-[#786F6A]">
                <p className="text-sm font-semibold text-[#2D2522]">No questions found</p>
                <p className="text-xs text-[#A89F98] mt-1">Try relaxing your search terms or filters.</p>
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
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#F4EFEA] border border-[#EBE4DC] text-xs font-medium text-[#4A423D] shadow-sm transition-all"
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
