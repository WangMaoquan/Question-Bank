import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { QuestionAnswer } from '@question-bank/types';

export class SubmitAnswerDto {
  @ApiProperty({ description: '题目ID', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ description: '用户答案', example: 'A' })
  @IsNotEmpty()
  userAnswer: QuestionAnswer; // Can be string, number, array, or object depending on question type

  @ApiProperty({ description: '耗时(秒)', required: false, example: 30 })
  @IsOptional()
  timeSpent?: number;
}
