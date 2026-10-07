export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ApproachDetails {
  intuition: string;
  algorithm: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  roleTarget: 'Ninja / Foundation' | 'Digital / Core' | 'Prime / Advanced';
  tags: string[];
  isPYQ: boolean;
  pyqSlot?: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  approach: ApproachDetails;
  pythonSolution: string;
  starterCode?: string;
  testCases?: TestCase[];
}
