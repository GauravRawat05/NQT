import React, { useState } from 'react';
import { CodingProblem } from '../../types/coding';
import { 
  Code2, 
  Lightbulb, 
  Play, 
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
  ExternalLink
} from 'lucide-react';

interface ProblemCardProps {
  problem: CodingProblem;
  isSolved: boolean;
  isBookmarked: boolean;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenPractice: (problem: CodingProblem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmark,
  onOpenPractice
}) => {
  const [showApproach, setShowApproach] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(problem.pythonSolution);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getRoleBadge = (role: string) => {
    if (role.includes('Ninja')) return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    if (role.includes('Digital')) return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-200 ${
      isSolved 
        ? 'bg-slate-900/60 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
    }`}>
      
      {/* Top Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getRoleBadge(problem.roleTarget)}`}>
            {problem.roleTarget}
          </span>
          {problem.isPYQ && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {problem.pyqSlot || 'TCS PYQ'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleBookmark(problem.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleSolved(problem.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isSolved 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      {/* Problem Title & Tags */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white tracking-tight hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => onOpenPractice(problem)}>
          {problem.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {problem.tags.map((tag, tIdx) => (
            <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Brief Description */}
      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-5">
        {problem.description}
      </p>

      {/* Sample Examples Preview */}
      {problem.examples && problem.examples[0] && (
        <div className="mb-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1.5">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Example 1</div>
          <div className="text-slate-300"><strong className="text-slate-400">Input:</strong> {problem.examples[0].input.replace(/\n/g, ' ')}</div>
          <div className="text-indigo-300"><strong className="text-slate-400">Output:</strong> {problem.examples[0].output.replace(/\n/g, ' ')}</div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Approach Button */}
          <button
            onClick={() => {
              setShowApproach(!showApproach);
              if (showSolution) setShowSolution(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showApproach
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Approach</span>
            {showApproach ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

          {/* Python Solution Button */}
          <button
            onClick={() => {
              setShowSolution(!showSolution);
              if (showApproach) setShowApproach(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showSolution
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Python Solution</span>
            {showSolution ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>

        {/* Toggle Practice in IDE Button */}
        <button
          onClick={() => onOpenPractice(problem)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Toggle Practice in IDE</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Accordion: Approach View */}
      {showApproach && (
        <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-4 animate-fadeIn">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Core Intuition & Logic</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {problem.approach.intuition}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Step-by-Step Algorithm
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              {problem.approach.algorithm.map((step, sIdx) => (
                <li key={sIdx} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time: <strong className="text-slate-200">{problem.approach.timeComplexity}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Space: <strong className="text-slate-200">{problem.approach.spaceComplexity}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Accordion: Python Solution View (Strictly Python, No Java/C++) */}
      {showSolution && (
        <div className="mt-4 rounded-2xl bg-slate-950 border border-indigo-500/20 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <span className="font-mono font-bold text-indigo-400 flex items-center space-x-1.5">
              <span>🐍</span>
              <span>Python 3 Optimal Solution</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed bg-slate-950/90">
            <code>{problem.pythonSolution}</code>
          </pre>
        </div>
      )}

    </div>
  );
};
