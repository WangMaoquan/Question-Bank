import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../users/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private questionsService: QuestionsService,
  ) {}

  async create(user: { id: string }, dto: CreateCommentDto) {
    // Verify question exists
    await this.questionsService.findOne(dto.questionId);

    // Verify parent comment exists if provided
    if (dto.parentId) {
      const parent = await this.findOne(dto.parentId);
      if (parent.questionId !== dto.questionId) {
        throw new ForbiddenException(
          'Parent comment belongs to a different question',
        );
      }
    }

    const comment = this.commentRepository.create({
      ...dto,
      userId: user.id,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(questionId: string) {
    return this.commentRepository.find({
      where: { questionId },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    user: { id: string; role: string },
    dto: UpdateCommentDto,
  ) {
    const comment = await this.findOne(id);

    if (comment.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = dto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: string, user: { id: string; role: string }) {
    const comment = await this.findOne(id);

    if (comment.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.commentRepository.remove(comment);
  }
}
