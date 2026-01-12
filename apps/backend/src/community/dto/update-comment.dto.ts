import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ description: '评论内容', example: '更新后的评论内容' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
