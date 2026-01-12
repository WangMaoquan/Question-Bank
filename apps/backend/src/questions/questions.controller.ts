import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionDto } from './dto/query-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Question, PaginatedResponse, UserRole } from '@question-bank/types';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@ApiTags('题目 (Questions)')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建题目', description: '创建新的题目' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @Post()
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Question> {
    return this.questionsService.create(createQuestionDto, req.user.id);
  }

  @ApiOperation({
    summary: '获取题目列表',
    description: '支持分页、筛选和搜索',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get()
  findAll(
    @Query() queryDto: QueryQuestionDto,
  ): Promise<PaginatedResponse<Question>> {
    return this.questionsService.findAll(queryDto);
  }

  @ApiOperation({
    summary: '获取题目详情',
    description: '根据 ID 获取题目详情',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '题目未找到' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '更新题目',
    description: '更新题目信息(仅作者或管理员)',
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Question> {
    return this.questionsService.update(
      id,
      updateQuestionDto,
      req.user.id,
      req.user.role,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '删除题目',
    description: '删除题目(仅作者或管理员)',
  })
  @ApiResponse({ status: 200, description: '删除成功' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.questionsService.remove(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: '增加浏览量', description: '题目浏览量 +1' })
  @Post(':id/view')
  incrementView(@Param('id') id: string): Promise<void> {
    return this.questionsService.incrementViewCount(id);
  }
}
