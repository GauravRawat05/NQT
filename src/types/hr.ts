export interface HRQuestion {
  id: number;
  question: string;
  category: 'Background & Goals' | 'TCS & Corporate Fit' | 'Behavioral & Leadership' | 'Technical Projects';
  modelAnswer: string;
  interviewerIntent: string;
  keyPoints: string[];
}
