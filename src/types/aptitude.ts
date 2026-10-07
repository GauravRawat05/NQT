export type AptitudeCategory = 'numerical' | 'verbal' | 'reasoning' | 'cs_logic';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  categoryLabel: string;
  subtopic: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed: 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export type AptitudeMode = 'practice' | 'mock_test';

export interface MockTestState {
  questions: AptitudeQuestion[];
  userAnswers: Record<string, number>; // questionId -> selectedOption (0..3)
  markedForReview: Record<string, boolean>;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  isFinished: boolean;
  score?: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
    percentage: number;
  };
}
