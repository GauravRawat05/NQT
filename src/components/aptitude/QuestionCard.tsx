import React, { useState } from 'react';
import { AptitudeQuestion } from '../../types/aptitude';
import { 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';

interface QuestionCardProps {
  question: AptitudeQuestion;
  index: number;
  isSolved: boolean;
  isBookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmark
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === question.correctAnswer && !isSolved) {
      onToggleSolved(question.id);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-200 ${
      isSolved 
        ? 'bg-slate-900/60 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
    }`}>
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Q{index + 1}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
            {question.subtopic}
          </span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
            question.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
            question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {question.difficulty || 'Standard'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onToggleSolved(question.id)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isSolved 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="text-slate-100 text-base leading-relaxed font-medium mb-6">
        {question.question}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, oIdx) => {
          const isChosen = selectedOption === oIdx;
          const isCorrect = oIdx === question.correctAnswer;
          const hasAnswered = selectedOption !== null;

          let btnClass = "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200";

          if (hasAnswered) {
            if (isCorrect) {
              btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 ring-1 ring-emerald-500/30";
            } else if (isChosen && !isCorrect) {
              btnClass = "bg-rose-500/20 border-rose-500/50 text-rose-200 ring-1 ring-rose-500/30";
            } else {
              btnClass = "bg-slate-900/40 border-slate-800 text-slate-400 opacity-70";
            }
          }

          return (
            <button
              key={oIdx}
              onClick={() => handleSelectOption(oIdx)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all group ${btnClass}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                  hasAnswered && isCorrect
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                    : hasAnswered && isChosen && !isCorrect
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 group-hover:border-slate-500'
                }`}>
                  {optionLabels[oIdx]}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {hasAnswered && isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />
              )}
              {hasAnswered && isChosen && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Toggle & Content */}
      <div className="pt-2">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showExplanation ? 'Hide Step-by-Step Solution' : 'View Step-by-Step Solution & Derivation'}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showExplanation && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-slate-300 text-sm leading-relaxed space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>Correct Answer: Option {optionLabels[question.correctAnswer]} ({question.options[question.correctAnswer]})</span>
            </div>
            <div className="text-slate-300 font-normal whitespace-pre-line pl-6 border-l-2 border-indigo-500/30">
              {question.explanation}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
