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

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Question> {
    return this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Get()
  findAll(
    @Query() queryDto: QueryQuestionDto,
  ): Promise<PaginatedResponse<Question>> {
    return this.questionsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.questionsService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string): Promise<void> {
    return this.questionsService.incrementViewCount(id);
  }
}
