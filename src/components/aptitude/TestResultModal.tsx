import React from 'react';
import { AptitudeQuestion, MockTestState } from '../../types/aptitude';
import { Trophy, Clock, RotateCcw, X, ArrowRight, Award } from 'lucide-react';
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [score]);

  if (!score) return null;

  const timeUsedSeconds = testState.totalTimeSeconds - testState.timeRemainingSeconds;
  const minutes = Math.floor(timeUsedSeconds / 60);
  const seconds = timeUsedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2522]/30 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white border border-[#EBE4DC] rounded-3xl p-6 sm:p-8 shadow-xl text-[#2D2522] animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#EBE4DC]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
              <Trophy className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#2D2522]">TCS NQT Scorecard</h2>
              <p className="text-xs text-[#786F6A]">Timed Mock Assessment Summary</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#A89F98] hover:text-[#2D2522] rounded-xl hover:bg-[#F4EFEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-[#F8F5F1] border border-[#EBE4DC] text-center">
            <div className="text-[11px] font-medium text-[#786F6A] uppercase tracking-wider">Score</div>
            <div className="text-2xl font-bold text-[#2D2522] mt-0.5">
              {score.correct} <span className="text-xs font-normal text-[#A89F98]">/ {score.total}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-center">
            <div className="text-[11px] font-medium text-[#166534] uppercase tracking-wider">Accuracy</div>
            <div className="text-2xl font-bold text-[#166534] mt-0.5">
              {score.percentage}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-center">
            <div className="text-[11px] font-medium text-[#9F1239] uppercase tracking-wider">Incorrect</div>
            <div className="text-2xl font-bold text-[#9F1239] mt-0.5">
              {score.incorrect}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-center">
            <div className="text-[11px] font-medium text-[#92400E] uppercase tracking-wider">Time Taken</div>
            <div className="text-xl font-bold text-[#92400E] mt-0.5">
              {minutes}m {seconds}s
            </div>
          </div>
        </div>

        {/* Qualification Projection Note */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EBE4DC] mb-5 flex items-start space-x-2.5">
          <Award className="w-4 h-4 text-[#B86B77] flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[#4A423D]">
            <span className="font-semibold text-[#2D2522]">Projection: </span>
            {score.percentage >= 75 ? (
              <span className="text-[#166534]">High probability for TCS Prime & Digital interview upgrades!</span>
            ) : score.percentage >= 50 ? (
              <span className="text-[#2D2522]">Eligible for TCS Ninja Foundation profile. Practice medium/hard coding problems to qualify for Digital.</span>
            ) : (
              <span className="text-[#92400E]">Needs further practice. Review the step-by-step solutions below to increase speed.</span>
            )}
          </div>
        </div>

        {/* Question Review List */}
        <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1.5 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#786F6A] mb-1.5">Question Review Key</h3>
          {questions.map((q, idx) => {
            const userAns = testState.userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isUnanswered = userAns === undefined;

            return (
              <div 
                key={q.id}
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isCorrect 
                    ? 'bg-[#F0FDF4] border-[#BBF7D0]' 
                    : isUnanswered 
                    ? 'bg-[#FAF7F2] border-[#EBE4DC]' 
                    : 'bg-[#FFF1F2] border-[#FECDD3]'
                }`}
              >
                <div className="flex items-center justify-between font-medium mb-1">
                  <span className="text-[#3D3531]">Q{idx + 1}: {q.subtopic}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isCorrect ? 'text-[#166534] bg-[#DCFCE7]' :
                    isUnanswered ? 'text-[#786F6A] bg-[#EFE8DF]' :
                    'text-[#9F1239] bg-[#FFE4E6]'
                  }`}>
                    {isCorrect ? 'Correct' : isUnanswered ? 'Skipped' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-[#4A423D] font-normal mb-1">{q.question}</p>
                <div className="flex flex-wrap gap-x-3 text-[11px] text-[#635A54] mt-1">
                  <span>Your Pick: <strong className={isCorrect ? 'text-[#166534]' : 'text-[#9F1239]'}>
                    {userAns !== undefined ? `Option ${String.fromCharCode(65 + userAns)}` : 'None'}
                  </strong></span>
                  <span>Correct: <strong className="text-[#166534]">Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})</strong></span>
                </div>
                <div className="mt-1 pt-1 border-t border-[#E8DFC9]/40 text-[#6B615A] italic text-[11px]">
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#EBE4DC]">
          <button
            onClick={onRestart}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#F4EFEA] hover:bg-[#EBE4DC] text-[#4A423D] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#2D2522] hover:bg-[#1F1A18] text-white shadow-sm transition-all"
          >
            <span>Back to Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
