import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import type { QuestionAnswer } from '@question-bank/types';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @IsNotEmpty()
  userAnswer: QuestionAnswer; // Can be string, number, array, or object depending on question type

  @IsOptional()
  timeSpent?: number;
}
