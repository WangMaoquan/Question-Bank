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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PracticeService } from './practice.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import type { AuthenticatedRequest } from '../auth/auth.controller';

@ApiTags('Practice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @ApiOperation({ summary: 'Submit an answer to a question' })
  @Post('submit')
  submitAnswer(@Req() req: AuthenticatedRequest, @Body() dto: SubmitAnswerDto) {
    return this.practiceService.submitAnswer(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get user practice records' })
  @Get('records')
  getRecords(@Req() req: AuthenticatedRequest) {
    return this.practiceService.getRecords(req.user.id);
  }

  @ApiOperation({ summary: 'Add a question to favorites' })
  @Post('favorites')
  addFavorite(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ) {
    return this.practiceService.addFavorite(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Remove a question from favorites' })
  @Delete('favorites/:questionId')
  removeFavorite(
    @Req() req: AuthenticatedRequest,
    @Param('questionId') questionId: string,
  ) {
    return this.practiceService.removeFavorite(req.user.id, questionId);
  }

  @ApiOperation({ summary: 'Get user favorites' })
  @Get('favorites')
  async getFavorites(@Req() req: AuthenticatedRequest) {
    const favorites = await this.practiceService.getFavorites(req.user.id);
    // Ideally map this to return question details directly if needed, or stick to favorite entity structure
    return favorites;
  }
}
