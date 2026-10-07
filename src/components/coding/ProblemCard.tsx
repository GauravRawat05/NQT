import React, { useState } from 'react';
import { CodingProblem } from '../../types/coding';
import { 
  Code2, 
  Lightbulb, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProblemCardProps {
  problem: CodingProblem;
  isSolved: boolean;
  isBookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenDetails?: (problem: CodingProblem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmark,
  onOpenDetails
}) => {
  const [showApproach, setShowApproach] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(problem.pythonSolution);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleSolved = () => {
    if (!isSolved) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    onToggleSolved(problem.id);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      case 'Medium':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'Hard':
        return 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]';
      default:
        return 'bg-[#F4EFEA] text-[#786F6A] border-[#E5DDD2]';
    }
  };

  const solutionLines = problem.pythonSolution.split('\n');

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isSolved 
        ? 'bg-[#FAFDF9] border-[#BBF7D0] shadow-sm' 
        : 'bg-white border-[#EBE4DC] hover:border-[#D9CFC4] shadow-sm hover:shadow-md'
    }`}>
      
      {/* Top Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-[#FAF7F2] text-[#635A54] border border-[#EBE4DC]">
            {problem.roleTarget}
          </span>
          {problem.isPYQ && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
              {problem.pyqSlot || 'TCS PYQ'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onToggleBookmark(problem.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]' 
                : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#A89F98] hover:text-[#2D2522]'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleSolved}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              isSolved 
                ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
                : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522] hover:bg-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      {/* Problem Title & Tags */}
      <div className="mb-2.5">
        <h3 
          className="text-base sm:text-lg font-semibold text-[#2D2522] tracking-tight hover:text-[#B86B77] transition-colors cursor-pointer"
          onClick={() => onOpenDetails && onOpenDetails(problem)}
        >
          {problem.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {problem.tags.map((tag, tIdx) => (
            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#8C827A] border border-[#EBE4DC] font-mono">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Problem Description */}
      <p className="text-xs sm:text-sm text-[#5A524D] leading-relaxed mb-4 font-normal whitespace-pre-line">
        {problem.description}
      </p>

      {/* Constraints if available */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] text-xs">
          <span className="text-[10px] font-semibold text-[#786F6A] uppercase tracking-wider block mb-1">Constraints:</span>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-[#5A524D]">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample Examples Preview */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-4 space-y-2">
          {problem.examples.slice(0, 2).map((ex, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EBE4DC] text-xs font-mono space-y-1">
              <div className="text-[#8C827A] font-semibold text-[10px] uppercase tracking-wider">Example {i + 1}</div>
              <div className="text-[#4A423D]"><strong className="text-[#786F6A]">Input:</strong> {ex.input.replace(/\n/g, ' ')}</div>
              <div className="text-[#2D2522] font-semibold"><strong className="text-[#786F6A]">Output:</strong> {ex.output.replace(/\n/g, ' ')}</div>
              {ex.explanation && (
                <div className="text-[#635A54] font-sans italic text-[11px] pt-0.5">
                  Explanation: {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EBE4DC]">
        <div className="flex items-center space-x-2">
          {/* Approach Button */}
          <button
            onClick={() => setShowApproach(!showApproach)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              showApproach
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] shadow-sm'
                : 'bg-[#FAF7F2] hover:bg-[#F4EFEA] border-[#EBE4DC] text-[#635A54]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Approach</span>
            {showApproach ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Python Solution Button */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              showSolution
                ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239] shadow-sm'
                : 'bg-[#FAF7F2] hover:bg-[#F4EFEA] border-[#EBE4DC] text-[#635A54]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#B86B77]" />
            <span>Python Solution</span>
            {showSolution ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        {/* Full Details Modal Button */}
        {onOpenDetails && (
          <button
            onClick={() => onOpenDetails(problem)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white shadow-sm transition-all"
            title="Open dedicated study view"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        )}
      </div>

      {/* Accordion: Approach View */}
      {showApproach && (
        <div className="mt-4 p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#EBE4DC] space-y-3.5 animate-fadeIn">
          <div>
            <div className="flex items-center space-x-1.5 text-[#92400E] font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Core Intuition</span>
            </div>
            <p className="text-[#4A423D] text-xs sm:text-sm leading-relaxed font-normal">
              {problem.approach.intuition}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#635A54] uppercase tracking-wider mb-2">
              Algorithm Steps
            </div>
            <ol className="space-y-1.5 text-xs text-[#5A524D]">
              {problem.approach.algorithm.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-[#EBE4DC] leading-relaxed">
                  <span className="font-semibold text-[#2D2522] min-w-4">{sIdx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-4 pt-2.5 border-t border-[#E8DFC9]/60 text-xs text-[#786F6A]">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#588157]" />
              <span>Time: <strong className="text-[#166534] font-mono font-semibold">{problem.approach.timeComplexity}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8B7EC8]" />
              <span>Space: <strong className="text-[#6B21A8] font-mono font-semibold">{problem.approach.spaceComplexity}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Accordion: Python Solution View (Strictly Python) */}
      {showSolution && (
        <div className="mt-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE4DC] overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4EFEA] border-b border-[#EBE4DC] text-xs">
            <span className="font-mono font-medium text-[#2D2522] flex items-center space-x-1.5">
              <span>🐍</span>
              <span className="font-semibold">Python 3 Solution</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#F9F5F0] border border-[#E5DDD2] text-[#4A423D] transition-colors shadow-sm"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5 text-[#786F6A]" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Viewer with line numbers */}
          <div className="flex text-xs font-mono bg-[#FAF7F2] overflow-x-auto">
            <div className="w-9 py-3 bg-[#F4EFEA]/60 text-[#A89F98] select-none text-right pr-2 border-r border-[#EBE4DC] text-[11px]">
              {solutionLines.map((_, i) => (
                <div key={i} className="leading-5 h-5">{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 p-3 text-[#2D2522] leading-5 font-mono overflow-x-auto">
              <code>{problem.pythonSolution}</code>
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
