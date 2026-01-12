import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { LikeTargetType } from '../entities/like.entity';

export class ToggleLikeDto {
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @IsNotEmpty()
  @IsEnum(LikeTargetType)
  targetType: LikeTargetType;
}
