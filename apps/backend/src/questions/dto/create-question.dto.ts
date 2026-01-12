import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionOption,
  type QuestionAnswer,
} from '@question-bank/types';

export class CreateQuestionDto {
  @ApiProperty({
    description: '题目类型',
    enum: QuestionType,
    example: QuestionType.SINGLE,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({ description: '题目标题', example: 'Vue3 生命周期' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '题目内容(Markdown)',
    example: '请简述 Vue3 的生命周期钩子',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '题目选项(选择题)', required: false })
  @IsOptional()
  @IsArray()
  options?: QuestionOption[];

  @ApiProperty({ description: '题目答案', example: 'A' })
  @IsNotEmpty()
  answer: QuestionAnswer;

  @ApiProperty({
    description: '答案解析',
    required: false,
    example: 'Vue3 生命周期包括...',
  })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({
    description: '难度',
    enum: QuestionDifficulty,
    example: QuestionDifficulty.MEDIUM,
  })
  @IsEnum(QuestionDifficulty)
  difficulty: QuestionDifficulty;

  @ApiProperty({ description: '分类ID', required: false, example: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: '标签ID列表',
    required: false,
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiProperty({ description: '是否公开', example: true })
  @IsBoolean()
  isPublic: boolean;
}
