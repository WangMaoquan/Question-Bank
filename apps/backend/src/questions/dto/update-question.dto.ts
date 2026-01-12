import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import {
  QuestionDifficulty,
  QuestionStatus,
  QuestionOption,
} from '@question-bank/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { QuestionAnswer } from '@question-bank/types';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  options?: QuestionOption[];

  @IsOptional()
  answer?: any;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;
}
