import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  QuestionDifficulty,
  QuestionStatus,
  QuestionOption,
} from '@question-bank/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { QuestionAnswer } from '@question-bank/types';

export class UpdateQuestionDto {
  @ApiProperty({ description: '题目标题', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '题目内容', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '选项', required: false })
  @IsOptional()
  @IsArray()
  options?: QuestionOption[];

  @ApiProperty({ description: '答案', required: false })
  @IsOptional()
  answer?: any;

  @ApiProperty({ description: '解析', required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({
    description: '难度',
    required: false,
    enum: QuestionDifficulty,
  })
  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @ApiProperty({ description: '分类ID', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ description: '标签ID列表', required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiProperty({ description: '是否公开', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: '状态', required: false, enum: QuestionStatus })
  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;
}
