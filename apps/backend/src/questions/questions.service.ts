import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionDto } from './dto/query-question.dto';
import { TagsService } from '../tags/tags.service';
import { PaginatedResponse, UserRole } from '@question-bank/types';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    private tagsService: TagsService,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    userId: string,
  ): Promise<Question> {
    const { tagIds, ...questionData } = createQuestionDto;

    const question = this.questionsRepository.create({
      ...questionData,
      createdBy: userId,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await Promise.all(
        tagIds.map((id) => this.tagsService.findOne(id)),
      );
      question.tags = tags;
    }

    return this.questionsRepository.save(question);
  }

  async findAll(
    queryDto: QueryQuestionDto,
  ): Promise<PaginatedResponse<Question>> {
    const {
      page = 1,
      limit = 10,
      type,
      difficulty,
      categoryId,
      tagIds,
      search,
      isPublic,
      createdBy,
      sortOrder,
    } = queryDto;

    const query = this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.category', 'category')
      .leftJoinAndSelect('question.tags', 'tags')
      .leftJoinAndSelect('question.creator', 'creator');

    // Filters
    if (type) {
      query.andWhere('question.type = :type', { type });
    }

    if (difficulty) {
      query.andWhere('question.difficulty = :difficulty', { difficulty });
    }

    if (categoryId) {
      query.andWhere('question.categoryId = :categoryId', { categoryId });
    }

    if (tagIds && tagIds.length > 0) {
      query.andWhere('tags.id IN (:...tagIds)', { tagIds });
    }

    if (search) {
      query.andWhere(
        '(question.title ILIKE :search OR question.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isPublic !== undefined) {
      query.andWhere('question.isPublic = :isPublic', { isPublic });
    }

    if (createdBy) {
      query.andWhere('question.createdBy = :createdBy', { createdBy });
    }

    // Pagination and sorting
    query
      .orderBy('question.createdAt', sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['category', 'tags', 'creator'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Question> {
    const question = await this.findOne(id);

    // Permission check: only owner or admin can update
    if (question.createdBy !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this question',
      );
    }

    const { tagIds, ...questionData } = updateQuestionDto;

    Object.assign(question, questionData);

    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await Promise.all(
          tagIds.map((tagId) => this.tagsService.findOne(tagId)),
        );
        question.tags = tags;
      } else {
        question.tags = [];
      }
    }

    return this.questionsRepository.save(question);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const question = await this.findOne(id);

    // Permission check: only owner or admin can delete
    if (question.createdBy !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this question',
      );
    }

    await this.questionsRepository.remove(question);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.questionsRepository.increment({ id }, 'viewCount', 1);
  }
}
