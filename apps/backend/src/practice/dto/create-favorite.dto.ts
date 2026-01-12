import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ description: '题目ID', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  questionId: string;
}
