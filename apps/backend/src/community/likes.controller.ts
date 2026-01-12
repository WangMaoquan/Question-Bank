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

@ApiTags('Likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: 'Toggle like status for a target (question/comment)',
  })
  @Post()
  toggleLike(@Req() req: AuthenticatedRequest, @Body() dto: ToggleLikeDto) {
    return this.likesService.toggleLike(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Check if user liked a specific target' })
  @Get('status')
  getLikeStatus(
    @Req() req: AuthenticatedRequest,
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: LikeTargetType,
  ) {
    return this.likesService.getLikeStatus(req.user.id, targetId, targetType);
  }
}
