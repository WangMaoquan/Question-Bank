import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionOption,
} from '@question-bank/types';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  options?: QuestionOption[];

  @IsNotEmpty()
  answer: any;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsEnum(QuestionDifficulty)
  difficulty: QuestionDifficulty;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsBoolean()
  isPublic: boolean;
}
