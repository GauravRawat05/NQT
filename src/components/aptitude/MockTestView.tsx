import React, { useState, useEffect } from 'react';
import { AptitudeQuestion, MockTestState } from '../../types/aptitude';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Send
} from 'lucide-react';
import { TestResultModal } from './TestResultModal';

interface MockTestViewProps {
  questions: AptitudeQuestion[];
  onExitMockTest: () => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({
  questions,
  onExitMockTest
}) => {
  const TOTAL_TIME = 20 * 60; // 20 minutes for mock exam
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [testState, setTestState] = useState<MockTestState | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const handleSubmitTest = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unanswered++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const finalState: MockTestState = {
      questions,
      userAnswers,
      markedForReview,
      timeRemainingSeconds: timeRemaining,
      totalTimeSeconds: TOTAL_TIME,
      isFinished: true,
      score: {
        correct,
        incorrect,
        unanswered,
        total,
        percentage
      }
    };

    setTestState(finalState);
    setIsFinished(true);
  };

  const currentQ = questions[currentIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isTimeCritical = timeRemaining < 300; // < 5 minutes

  const selectOption = (optIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const clearCurrentResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const toggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const restartTest = () => {
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemaining(TOTAL_TIME);
    setIsFinished(false);
    setTestState(null);
    setCurrentIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Test Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs">
            TCS NQT Timed Simulation
          </div>
          <span className="text-slate-400 text-sm hidden sm:inline">
            Total Questions: <strong className="text-white">{questions.length}</strong>
          </span>
        </div>

        {/* Live Timer */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono text-base font-bold transition-colors ${
          isTimeCritical 
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' 
            : 'bg-slate-800/80 border-slate-700 text-cyan-300'
        }`}>
          <Clock className="w-5 h-5" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onExitMockTest}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Exit Exam
          </button>
          <button
            onClick={handleSubmitTest}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main Test Grid (Question on Left, Palette on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Columns: Active Question Area */}
        <div className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-indigo-400">Question {currentIdx + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {currentQ.subtopic}
                </span>
              </div>
              <button
                onClick={toggleReview}
                className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  markedForReview[currentQ.id]
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed mb-8">
              {currentQ.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => selectOption(oIdx)}
                    className={`w-full flex items-center space-x-3.5 p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                        : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-slate-400'
                    }`}>
                      {optionLetters[oIdx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Nav Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={clearCurrentResponse}
              disabled={userAnswers[currentQ.id] === undefined}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Clear Choice
            </button>
          </div>
        </div>

        {/* Right 1 Column: Question Palette */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-200 mb-4 pb-3 border-b border-slate-800">
              Question Palette
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500/80" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-purple-500/80" />
                <span>Reviewed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-700" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded border-2 border-cyan-400 bg-slate-800" />
                <span>Current</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isReviewed = markedForReview[q.id];

                let bgClass = "bg-slate-800/80 text-slate-400 hover:bg-slate-700";
                if (isReviewed) {
                  bgClass = "bg-purple-600/80 text-white font-bold";
                } else if (isAnswered) {
                  bgClass = "bg-emerald-600 text-white font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <div className="text-xs text-slate-400 text-center mb-3">
              Answered: <strong className="text-emerald-400">{Object.keys(userAnswers).length}</strong> / {questions.length}
            </div>
            <button
              onClick={handleSubmitTest}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              Submit Test & View Results
            </button>
          </div>
        </div>

      </div>

      {/* Scorecard Modal */}
      {isFinished && testState && (
        <TestResultModal
          testState={testState}
          onClose={() => {
            setIsFinished(false);
            onExitMockTest();
          }}
          onRestart={restartTest}
        />
      )}
    </div>
  );
};
