import React, { useState, useMemo } from 'react';
import { HRQuestion } from '../../types/hr';
import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  CheckCircle2, 
  Compass, 
  Lightbulb,
  Building2
} from 'lucide-react';
import rawHRData from '../../data/hr.json';

export const HRSection: React.FC = () => {
  const allQuestions = rawHRData as HRQuestion[];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const categories = [
    'all',
    'Background & Goals',
    'TCS & Corporate Fit',
    'Behavioral & Leadership',
    'Technical Projects'
  ];

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          q.modelAnswer.toLowerCase().includes(query) ||
          q.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allQuestions, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#EBE4DC] shadow-sm">
        <div>
          <div className="flex items-center space-x-1.5 text-[#D97706] font-semibold text-xs tracking-wide uppercase mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Tata Consultancy Services HR & Managerial</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2D2522] tracking-tight">
            TCS HR & Behavioral Master
          </h1>
          <p className="text-xs sm:text-sm text-[#786F6A] mt-1 max-w-xl font-normal leading-relaxed">
            50 essential interview questions curated specifically for Ninja, Digital, and Prime candidates.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#EBE4DC]">
          <div className="text-center px-3.5">
            <div className="text-[11px] text-[#D97706] font-semibold">Total Q&As</div>
            <div className="text-lg font-bold text-[#2D2522]">{allQuestions.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89F98]" />
          <input
            type="text"
            placeholder="Search questions (e.g. relocate, project)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] focus:border-[#C4B7A6] focus:outline-none text-xs text-[#2D2522] placeholder:text-[#A89F98]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1 w-full sm:w-auto justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#2D2522] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#786F6A] hover:text-[#2D2522] border border-[#EBE4DC]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Question Accordion Cards */}
      <div className="space-y-3.5">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE4DC] text-[#786F6A]">
            <p className="text-sm font-semibold text-[#2D2522]">No HR questions found</p>
            <p className="text-xs text-[#A89F98] mt-1">Try searching for other keywords.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-[#EBE4DC] bg-white overflow-hidden transition-all duration-200 shadow-sm hover:border-[#D9CFC4]"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-[#FAF7F2]/60"
                >
                  <div className="flex items-center space-x-3 pr-3">
                    <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-semibold text-xs">
                      #{q.id}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#2D2522] tracking-tight">
                        {q.question}
                      </h3>
                      <span className="text-[10px] text-[#8C827A] font-mono mt-0.5 inline-block">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-[#786F6A] bg-[#FAF7F2] border border-[#EBE4DC]">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#EBE4DC] space-y-3.5 bg-[#FAF7F2]/40 animate-fadeIn">
                    
                    {/* Model Response */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#166534] mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Recommended Model Answer</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-[#EBE4DC] text-[#4A423D] text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans shadow-sm">
                        "{q.modelAnswer}"
                      </div>
                    </div>

                    {/* Interviewer Intent Box */}
                    <div className="p-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-start space-x-2.5 text-xs">
                      <Compass className="w-3.5 h-3.5 text-[#8B7EC8] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#5B21B6]">What the Interviewer Evaluates: </span>
                        <span className="text-[#4C1D95]">{q.interviewerIntent}</span>
                      </div>
                    </div>

                    {/* Delivery Tips */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#92400E] mb-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Delivery Guidance</span>
                      </div>
                      <ul className="space-y-1 text-xs text-[#5A524D]">
                        {q.keyPoints.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#588157] flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
