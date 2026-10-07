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
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isSolved 
        ? 'bg-[#FAFDF9] border-[#BBF7D0] shadow-sm' 
        : 'bg-white border-[#EBE4DC] hover:border-[#D9CFC4] shadow-sm hover:shadow-md'
    }`}>
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F4EFEA] text-[#786F6A] border border-[#E5DDD2]">
            Q{index + 1}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#FAF7F2] text-[#635A54] border border-[#EBE4DC]">
            {question.subtopic}
          </span>
          <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${
            question.difficulty === 'Hard' ? 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]' :
            question.difficulty === 'Medium' ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' :
            'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
          }`}>
            {question.difficulty || 'Standard'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]' 
                : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#A89F98] hover:text-[#2D2522]'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onToggleSolved(question.id)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              isSolved 
                ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
                : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522] hover:bg-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="text-[#2D2522] text-sm sm:text-base leading-relaxed font-normal mb-5">
        {question.question}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
        {question.options.map((opt, oIdx) => {
          const isChosen = selectedOption === oIdx;
          const isCorrect = oIdx === question.correctAnswer;
          const hasAnswered = selectedOption !== null;

          let btnClass = "bg-[#FDFBF9] border-[#EBE4DC] hover:bg-[#F7F2EC] hover:border-[#D9CFC4] text-[#3D3531]";

          if (hasAnswered) {
            if (isCorrect) {
              btnClass = "bg-[#F0FDF4] border-[#86EFAC] text-[#166534] shadow-sm";
            } else if (isChosen && !isCorrect) {
              btnClass = "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]";
            } else {
              btnClass = "bg-[#F8F5F1]/60 border-[#EFE8DF] text-[#A89F98] opacity-75";
            }
          }

          return (
            <button
              key={oIdx}
              onClick={() => handleSelectOption(oIdx)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-normal transition-all duration-200 group ${btnClass}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-medium border transition-colors ${
                  hasAnswered && isCorrect
                    ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#166534]'
                    : hasAnswered && isChosen && !isCorrect
                    ? 'bg-[#FFE4E6] border-[#FECDD3] text-[#9F1239]'
                    : 'bg-[#FAF7F2] border-[#E5DDD2] text-[#786F6A] group-hover:border-[#C4B7A6]'
                }`}>
                  {optionLabels[oIdx]}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {hasAnswered && isCorrect && (
                <CheckCircle className="w-4 h-4 text-[#166534] flex-shrink-0 ml-2" />
              )}
              {hasAnswered && isChosen && !isCorrect && (
                <XCircle className="w-4 h-4 text-[#9F1239] flex-shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Toggle & Content */}
      <div className="pt-2">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center space-x-1.5 text-xs font-medium text-[#786F6A] hover:text-[#2D2522] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B86B77]" />
          <span>{showExplanation ? 'Hide Derivation' : 'View Step-by-Step Derivation'}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showExplanation && (
          <div className="mt-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] text-[#4A423D] text-xs sm:text-sm leading-relaxed space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#166534] font-medium text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Correct Answer: Option {optionLabels[question.correctAnswer]} ({question.options[question.correctAnswer]})</span>
            </div>
            <div className="text-[#5A524D] font-normal whitespace-pre-line pl-4 border-l-2 border-[#D9CFC4]">
              {question.explanation}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
