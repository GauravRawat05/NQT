import React, { useState, useMemo } from 'react';
import { HRQuestion } from '../../types/hr';
import { 
  Users, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  CheckCircle2, 
  Compass, 
  Lightbulb,
  Building2,
  Briefcase
} from 'lucide-react';
import rawHRData from '../../data/hr.json';

export const HRSection: React.FC = () => {
  const allQuestions = rawHRData as HRQuestion[];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(1); // expand question 1 by default

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Tata Consultancy Services HR & Managerial Rounds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            TCS HR & Behavioral Interview Master
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            50 essential interview questions curated specifically for TCS Ninja, Digital, and Prime candidates, complete with recommended response frameworks.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <div className="text-center px-4">
            <div className="text-xs text-amber-400 font-bold">Total Q&As</div>
            <div className="text-xl font-extrabold text-white">{allQuestions.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions (e.g. relocate, project, weakness)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Question Accordion Cards */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <p className="text-base font-semibold text-slate-300">No HR questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for other keywords.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all hover:border-slate-700 shadow-md"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/40"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-xs">
                      #{q.id}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {q.question}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/60">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-950/40 animate-fadeIn">
                    
                    {/* Recommended Model Response */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Recommended Model Answer</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                        "{q.modelAnswer}"
                      </div>
                    </div>

                    {/* Interviewer Intent Box */}
                    <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start space-x-3 text-xs">
                      <Compass className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-300">What the Interviewer Evaluates: </span>
                        <span className="text-slate-300">{q.interviewerIntent}</span>
                      </div>
                    </div>

                    {/* Strategic Key Tips */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                        <Lightbulb className="w-4 h-4" />
                        <span>Pro Delivery Tips</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {q.keyPoints.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
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
