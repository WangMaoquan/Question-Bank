import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: '题目ID', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ description: '评论内容', example: '这道题很有趣！' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: '父评论ID(回复)',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
