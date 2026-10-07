import React, { useState } from 'react';
import { CodingProblem } from '../../types/coding';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Lightbulb, 
  Code2, 
  Check, 
  Copy, 
  Sparkles,
  Clock,
  Cpu,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProblemDetailModalProps {
  problem: CodingProblem;
  isSolved: boolean;
  isBookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmark,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'approach' | 'solution'>('desc');
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  const handleCopySolution = () => {
    navigator.clipboard.writeText(problem.pythonSolution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleSolvedClick = () => {
    if (!isSolved) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    onToggleSolved(problem.id);
  };

  const solutionLines = problem.pythonSolution.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2D2522]/30 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-h-[92vh] max-w-4xl bg-white border border-[#EBE4DC] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#2D2522]">
        
        {/* Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#EBE4DC] bg-[#FAF7F2]">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border shrink-0 ${
              problem.difficulty === 'Easy' ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]' :
              problem.difficulty === 'Medium' ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' :
              'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'
            }`}>
              {problem.difficulty}
            </span>
            <span className="hidden sm:inline px-2 py-0.5 text-[11px] font-medium rounded-lg bg-white text-[#635A54] border border-[#EBE4DC] shrink-0">
              {problem.roleTarget}
            </span>
            {problem.isPYQ && (
              <span className="hidden md:inline px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] shrink-0">
                {problem.pyqSlot || 'TCS PYQ'}
              </span>
            )}
            <h2 className="text-sm sm:text-base font-semibold text-[#2D2522] tracking-tight truncate">
              {problem.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(problem.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]' 
                  : 'bg-white border-[#EBE4DC] text-[#A89F98] hover:text-[#2D2522]'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={handleSolvedClick}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                isSolved 
                  ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
                  : 'bg-white border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#786F6A] hover:text-[#2D2522] hover:bg-[#F4EFEA] rounded-xl transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 px-5 py-2.5 bg-[#FAF7F2] border-b border-[#EBE4DC] text-xs">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'desc'
                ? 'bg-white text-[#2D2522] shadow-sm border border-[#EBE4DC]'
                : 'text-[#786F6A] hover:text-[#2D2522]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Problem Statement</span>
          </button>

          <button
            onClick={() => setActiveTab('approach')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'approach'
                ? 'bg-white text-[#92400E] shadow-sm border border-[#EBE4DC]'
                : 'text-[#786F6A] hover:text-[#2D2522]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Approach & Complexity</span>
          </button>

          <button
            onClick={() => setActiveTab('solution')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'solution'
                ? 'bg-white text-[#B86B77] shadow-sm border border-[#EBE4DC]'
                : 'text-[#786F6A] hover:text-[#2D2522]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#B86B77]" />
            <span>Python Solution</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-[#3D3531]">
          
          {/* TAB 1: Problem Statement & Examples */}
          {activeTab === 'desc' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A] mb-2">
                  Problem Description
                </h3>
                <div className="text-[#4A423D] leading-relaxed whitespace-pre-line text-sm font-normal bg-[#FAF7F2]/50 p-4 rounded-2xl border border-[#EBE4DC]">
                  {problem.description}
                </div>
              </div>

              {problem.constraints && problem.constraints.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A] mb-2">
                    Constraints
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EBE4DC]">
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#5A524D] font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {problem.examples && problem.examples.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A]">
                    Sample Test Cases & Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE4DC] space-y-2.5 text-xs font-mono shadow-sm">
                        <div className="text-[#B86B77] font-semibold uppercase text-[11px]">
                          Example {i + 1}
                        </div>
                        <div>
                          <span className="text-[#786F6A] font-semibold block mb-0.5">Input:</span>
                          <pre className="p-2 rounded-xl bg-white text-[#2D2522] overflow-x-auto whitespace-pre-wrap border border-[#EBE4DC]">
                            {ex.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[#786F6A] font-semibold block mb-0.5">Output:</span>
                          <pre className="p-2 rounded-xl bg-white text-[#166534] font-semibold overflow-x-auto whitespace-pre-wrap border border-[#EBE4DC]">
                            {ex.output}
                          </pre>
                        </div>
                        {ex.explanation && (
                          <div className="text-[#635A54] font-sans italic text-[11px] pt-1">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('approach')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white transition-all shadow-sm"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>View Approach & Logic</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Approach & Complexity */}
          {activeTab === 'approach' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4.5 rounded-2xl bg-[#FFFBEB]/70 border border-[#FDE68A]">
                <div className="flex items-center space-x-1.5 text-[#92400E] font-semibold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>Core Intuition</span>
                </div>
                <p className="text-[#4A423D] leading-relaxed text-sm font-normal">
                  {problem.approach.intuition}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A] mb-2.5">
                  Step-by-Step Algorithm
                </h3>
                <ol className="space-y-2 text-xs sm:text-sm text-[#4A423D]">
                  {problem.approach.algorithm.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#EBE4DC]">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2D2522] text-white text-[11px] font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
                  <div className="flex items-center space-x-1.5 text-[#166534] font-semibold text-xs mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Time Complexity</span>
                  </div>
                  <div className="font-mono text-sm text-[#166534] font-bold">
                    {problem.approach.timeComplexity}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE]">
                  <div className="flex items-center space-x-1.5 text-[#6B21A8] font-semibold text-xs mb-1">
                    <Cpu className="w-4 h-4" />
                    <span>Space Complexity</span>
                  </div>
                  <div className="font-mono text-sm text-[#6B21A8] font-bold">
                    {problem.approach.spaceComplexity}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('solution')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white transition-all shadow-sm"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#FECDD3]" />
                  <span>View Python 3 Solution</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Python Solution */}
          {activeTab === 'solution' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">🐍</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B86B77]">
                    Python 3 Verified Solution
                  </span>
                </div>

                <button
                  onClick={handleCopySolution}
                  className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#EBE4DC] text-[#4A423D] shadow-sm transition-colors"
                >
                  {copiedSolution ? (
                    <Check className="w-3.5 h-3.5 text-[#166534]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#786F6A]" />
                  )}
                  <span>{copiedSolution ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code viewer with line numbers */}
              <div className="rounded-2xl border border-[#EBE4DC] bg-[#FAF7F2] overflow-hidden shadow-sm flex text-xs font-mono">
                {/* Line numbers gutter */}
                <div className="w-10 py-4 bg-[#F4EFEA] text-[#A89F98] select-none text-right pr-2.5 border-r border-[#EBE4DC] text-[11px]">
                  {solutionLines.map((_, i) => (
                    <div key={i} className="leading-5 h-5">{i + 1}</div>
                  ))}
                </div>

                {/* Solution code */}
                <pre className="flex-1 p-4 bg-[#FAF7F2] text-[#2D2522] overflow-x-auto leading-5 font-mono">
                  <code>{problem.pythonSolution}</code>
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EBE4DC] flex items-center justify-between text-xs text-[#786F6A]">
                <span>Time Complexity: <strong className="text-[#588157] font-mono">{problem.approach.timeComplexity}</strong></span>
                <span>Space Complexity: <strong className="text-[#8B7EC8] font-mono">{problem.approach.spaceComplexity}</strong></span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
