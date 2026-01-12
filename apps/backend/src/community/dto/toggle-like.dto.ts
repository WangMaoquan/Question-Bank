import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LikeTargetType } from '../entities/like.entity';

export class ToggleLikeDto {
  @ApiProperty({ description: '目标ID(题目ID或评论ID)', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @ApiProperty({
    description: '目标类型',
    enum: LikeTargetType,
    example: LikeTargetType.QUESTION,
  })
  @IsNotEmpty()
  @IsEnum(LikeTargetType)
  targetType: LikeTargetType;
}
