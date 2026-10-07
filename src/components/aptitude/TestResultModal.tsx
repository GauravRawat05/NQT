import React from 'react';
import { AptitudeQuestion, MockTestState } from '../../types/aptitude';
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw, X, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestResultModalProps {
  testState: MockTestState;
  onClose: () => void;
  onRestart: () => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  testState,
  onClose,
  onRestart
}) => {
  const score = testState.score;
  const questions = testState.questions;

  React.useEffect(() => {
    if (score && score.percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [score]);

  if (!score) return null;

  const timeUsedSeconds = testState.totalTimeSeconds - testState.timeRemainingSeconds;
  const minutes = Math.floor(timeUsedSeconds / 60);
  const seconds = timeUsedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">TCS NQT Mock Test Scorecard</h2>
              <p className="text-xs text-slate-400">Comprehensive Assessment Breakdown & Answer Key</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Score</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
              {score.correct} <span className="text-sm font-normal text-slate-500">/ {score.total}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Accuracy</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {score.percentage}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Incorrect</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">
              {score.incorrect}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Time Taken</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">
              {minutes}m {seconds}s
            </div>
          </div>
        </div>

        {/* NQT Cutoff Analysis */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-6 flex items-start space-x-3">
          <Award className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-white">NQT Qualification Projection: </span>
            {score.percentage >= 75 ? (
              <span className="text-emerald-400 font-medium">Eligible for TCS Prime & Digital Interview Upgrades! Outstanding percentile.</span>
            ) : score.percentage >= 50 ? (
              <span className="text-blue-400 font-medium">Clear cut-off for TCS Ninja Foundation profile. Recommend practicing more Hard problems for Digital upgrades.</span>
            ) : (
              <span className="text-amber-400 font-medium">Needs further practice. Review the step-by-step solutions below to strengthen foundational speed.</span>
            )}
          </div>
        </div>

        {/* Question Review List */}
        <div className="max-h-72 overflow-y-auto space-y-3 pr-2 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Question Review</h3>
          {questions.map((q, idx) => {
            const userAns = testState.userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isUnanswered = userAns === undefined;

            return (
              <div 
                key={q.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : isUnanswered 
                    ? 'bg-slate-800/40 border-slate-700/60' 
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span className="text-slate-300">Q{idx + 1}: {q.subtopic}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    isCorrect ? 'text-emerald-400 bg-emerald-500/10' :
                    isUnanswered ? 'text-slate-400 bg-slate-700/30' :
                    'text-rose-400 bg-rose-500/10'
                  }`}>
                    {isCorrect ? 'Correct' : isUnanswered ? 'Skipped' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-slate-300 font-normal mb-1">{q.question}</p>
                <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400 mt-1">
                  <span>Your Answer: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                    {userAns !== undefined ? `Option ${String.fromCharCode(65 + userAns)}` : 'None'}
                  </strong></span>
                  <span>Correct: <strong className="text-emerald-400">Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})</strong></span>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-700/40 text-slate-400 italic">
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            onClick={onRestart}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-colors"
          >
            <span>Back to Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
