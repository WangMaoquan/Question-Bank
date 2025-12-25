/**
 * Practice record entity
 */
export interface PracticeRecord {
  id: string;
  userId: string;
  questionId: string;
  question?: any;
  userAnswer: any;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: Date;
}

/**
 * Submit answer DTO
 */
export interface SubmitAnswerDto {
  questionId: string;
  userAnswer: any;
  timeSpent: number;
}

/**
 * Practice statistics
 */
export interface PracticeStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
}

/**
 * Favorite entity
 */
export interface Favorite {
  id: string;
  userId: string;
  questionId: string;
  question?: any;
  createdAt: Date;
}
