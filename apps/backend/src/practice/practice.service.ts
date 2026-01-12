import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeRecord } from './entities/practice-record.entity';
import { Favorite } from './entities/favorite.entity';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(PracticeRecord)
    private practiceRecordRepository: Repository<PracticeRecord>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private questionsService: QuestionsService,
  ) {}

  async submitAnswer(userId: string, dto: SubmitAnswerDto) {
    const question = await this.questionsService.findOne(dto.questionId);

    // Simple equality check for now.
    // Ideally, this logic should be more sophisticated based on question type.
    const isCorrect =
      JSON.stringify(dto.userAnswer) === JSON.stringify(question.answer);

    const record = this.practiceRecordRepository.create({
      userId,
      questionId: dto.questionId,
      userAnswer: dto.userAnswer,
      isCorrect,
      timeSpent: dto.timeSpent || 0,
    });

    return this.practiceRecordRepository.save(record);
  }

  async getRecords(userId: string) {
    return this.practiceRecordRepository.find({
      where: { userId },
      relations: ['question'],
      order: { createdAt: 'DESC' },
    });
  }

  async addFavorite(userId: string, dto: CreateFavoriteDto) {
    // Check if duplicate
    const exists = await this.favoriteRepository.findOne({
      where: { userId, questionId: dto.questionId },
    });
    if (exists) {
      throw new ConflictException('Question already favorited');
    }

    // Check if question exists
    await this.questionsService.findOne(dto.questionId);

    const favorite = this.favoriteRepository.create({
      userId,
      questionId: dto.questionId,
    });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, questionId: string) {
    const result = await this.favoriteRepository.delete({ userId, questionId });
    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }
    return { success: true };
  }

  async getFavorites(userId: string) {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['question'],
      order: { createdAt: 'DESC' },
    });
  }
}
