import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { AuthenticatedRequest } from '../auth/auth.controller';

@ApiTags('评论 (Comments)')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发表评论', description: '对题目发表评论' })
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(req.user, dto);
  }

  @ApiOperation({
    summary: '获取评论列表',
    description: '获取指定题目的所有评论',
  })
  @Get()
  findAll(@Query('questionId') questionId: string) {
    return this.commentsService.findAll(questionId);
  }

  @ApiOperation({
    summary: '获取评论详情',
    description: '根据 ID 获取评论详情',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新评论', description: '更新评论内容(仅作者)' })
  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '删除评论',
    description: '删除评论(仅作者或管理员)',
  })
  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.commentsService.remove(id, req.user);
  }
}
