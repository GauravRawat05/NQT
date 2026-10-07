import React, { useState, useEffect } from 'react';
import { AptitudeQuestion, MockTestState } from '../../types/aptitude';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
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
  const TOTAL_TIME = 20 * 60; // 20 minutes
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [testState, setTestState] = useState<MockTestState | null>(null);

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
  const isTimeCritical = timeRemaining < 300;

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
    <div className="space-y-5 animate-fadeIn">
      {/* Top Test Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-xl bg-[#F4EFEA] text-[#786F6A] border border-[#E5DDD2] font-semibold text-xs">
            Timed NQT Simulation
          </div>
          <span className="text-[#786F6A] text-xs hidden sm:inline">
            Total Questions: <strong className="text-[#2D2522]">{questions.length}</strong>
          </span>
        </div>

        {/* Live Timer */}
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-semibold transition-colors ${
          isTimeCritical 
            ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239] animate-pulse' 
            : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onExitMockTest}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#F8F5F1] hover:bg-[#EFE8DF] text-[#786F6A] border border-[#EBE4DC] transition-colors"
          >
            Exit Exam
          </button>
          <button
            onClick={handleSubmitTest}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main Test Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left 3 Columns: Active Question Area */}
        <div className="lg:col-span-3 p-6 sm:p-7 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm flex flex-col justify-between">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EBE4DC]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#B86B77]">Question {currentIdx + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-[#786F6A] border border-[#EBE4DC]">
                  {currentQ.subtopic}
                </span>
              </div>
              <button
                onClick={toggleReview}
                className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1 rounded-lg border transition-all ${
                  markedForReview[currentQ.id]
                    ? 'bg-[#F3E8FF] border-[#DDD6FE] text-[#6B21A8]'
                    : 'bg-[#FAF7F2] border-[#EBE4DC] text-[#786F6A] hover:text-[#2D2522]'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-[#2D2522] text-sm sm:text-base font-normal leading-relaxed mb-6">
              {currentQ.question}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => selectOption(oIdx)}
                    className={`w-full flex items-center space-x-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-normal transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#F4EFEA] border-[#C4B7A6] text-[#2D2522] ring-1 ring-[#C4B7A6] shadow-sm'
                        : 'bg-[#FDFBF9] border-[#EBE4DC] hover:bg-[#F9F5F0] hover:border-[#D9CFC4] text-[#4A423D]'
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#2D2522] border-[#2D2522] text-white'
                        : 'bg-[#FAF7F2] border-[#E5DDD2] text-[#786F6A]'
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[#EBE4DC]">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#F8F5F1] hover:bg-[#EFE8DF] disabled:opacity-40 disabled:pointer-events-none text-[#5A524D] border border-[#EBE4DC] transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#F8F5F1] hover:bg-[#EFE8DF] disabled:opacity-40 disabled:pointer-events-none text-[#5A524D] border border-[#EBE4DC] transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={clearCurrentResponse}
              disabled={userAnswers[currentQ.id] === undefined}
              className="text-xs font-medium text-[#A89F98] hover:text-[#2D2522] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Clear Choice
            </button>
          </div>
        </div>

        {/* Right 1 Column: Question Palette */}
        <div className="p-5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A] mb-3 pb-2 border-b border-[#EBE4DC]">
              Question Palette
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#786F6A] mb-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded bg-[#DCFCE7] border border-[#86EFAC]" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded bg-[#F3E8FF] border border-[#DDD6FE]" />
                <span>Reviewed</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded bg-[#F4EFEA] border border-[#E5DDD2]" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded border-2 border-[#B86B77] bg-white" />
                <span>Current</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isReviewed = markedForReview[q.id];

                let bgClass = "bg-[#F8F5F1] text-[#786F6A] hover:bg-[#EFE8DF] border border-[#EBE4DC]";
                if (isReviewed) {
                  bgClass = "bg-[#F3E8FF] text-[#6B21A8] border border-[#DDD6FE] font-semibold";
                } else if (isAnswered) {
                  bgClass = "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] font-semibold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-[#B86B77] ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE4DC] mt-4">
            <div className="text-[11px] text-[#786F6A] text-center mb-2.5">
              Answered: <strong className="text-[#166534]">{Object.keys(userAnswers).length}</strong> / {questions.length}
            </div>
            <button
              onClick={handleSubmitTest}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white shadow-sm transition-all"
            >
              Submit & View Results
            </button>
          </div>
        </div>

      </div>

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
