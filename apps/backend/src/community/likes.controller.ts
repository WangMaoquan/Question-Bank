import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { LikeTargetType } from './entities/like.entity';
import type { AuthenticatedRequest } from '../auth/auth.controller';

@ApiTags('点赞 (Likes)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: '切换点赞状态',
    description: '对题目或评论进行点赞/取消点赞',
  })
  @Post()
  toggleLike(@Req() req: AuthenticatedRequest, @Body() dto: ToggleLikeDto) {
    return this.likesService.toggleLike(req.user.id, dto);
  }

  @ApiOperation({
    summary: '检查点赞状态',
    description: '检查当前用户是否已点赞',
  })
  @Get('status')
  getLikeStatus(
    @Req() req: AuthenticatedRequest,
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: LikeTargetType,
  ) {
    return this.likesService.getLikeStatus(req.user.id, targetId, targetType);
  }
}
