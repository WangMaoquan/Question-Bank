import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PracticeService } from './practice.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import type { AuthenticatedRequest } from '../auth/auth.controller';

@ApiTags('练习 (Practice)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @ApiOperation({ summary: '提交答案', description: '提交题目答案并获取结果' })
  @ApiResponse({ status: 201, description: '提交成功' })
  @Post('submit')
  submitAnswer(
    @Req() req: AuthenticatedRequest,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.practiceService.submitAnswer(req.user.id, submitAnswerDto);
  }

  @ApiOperation({
    summary: '获取练习记录',
    description: '获取用户的练习提交记录',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('records')
  getRecords(@Req() req: AuthenticatedRequest) {
    return this.practiceService.getRecords(req.user.id);
  }

  @ApiOperation({ summary: '添加收藏', description: '收藏题目' })
  @ApiResponse({ status: 201, description: '收藏成功' })
  @Post('favorites')
  addFavorite(
    @Req() req: AuthenticatedRequest,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.practiceService.addFavorite(req.user.id, createFavoriteDto);
  }

  @ApiOperation({ summary: '取消收藏', description: '取消收藏题目' })
  @ApiResponse({ status: 200, description: '取消收藏成功' })
  @Delete('favorites/:questionId')
  removeFavorite(
    @Req() req: AuthenticatedRequest,
    @Param('questionId') questionId: string,
  ) {
    return this.practiceService.removeFavorite(req.user.id, questionId);
  }

  @ApiOperation({ summary: '获取收藏列表', description: '获取用户收藏的题目' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('favorites')
  async getFavorites(@Req() req: AuthenticatedRequest) {
    const favorites = await this.practiceService.getFavorites(req.user.id);
    // Ideally map this to return question details directly if needed, or stick to favorite entity structure
    return favorites;
  }
}
