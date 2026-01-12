import { IsNotEmpty, IsUUID, IsJSON, IsOptional } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @IsNotEmpty()
  userAnswer: any; // Can be string, number, array, or object depending on question type

  @IsOptional()
  timeSpent?: number;
}
