import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Like, LikeTargetType } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { Question } from '../questions/entities/question.entity';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private dataSource: DataSource,
  ) {}

  async toggleLike(userId: string, dto: ToggleLikeDto) {
    const { targetId, targetType } = dto;

    // Check if target exists
    await this.checkTargetExists(targetId, targetType);

    const existingLike = await this.likeRepository.findOne({
      where: { userId, targetId, targetType },
    });

    if (existingLike) {
      await this.removeLike(existingLike, targetId, targetType);
      return { liked: false };
    } else {
      await this.addLike(userId, targetId, targetType);
      return { liked: true };
    }
  }

  async getLikeStatus(
    userId: string,
    targetId: string,
    targetType: LikeTargetType,
  ) {
    const count = await this.likeRepository.count({
      where: { userId, targetId, targetType },
    });
    return { liked: count > 0 };
  }

  private async checkTargetExists(
    targetId: string,
    targetType: LikeTargetType,
  ) {
    const repo =
      targetType === LikeTargetType.QUESTION
        ? this.dataSource.getRepository(Question)
        : this.dataSource.getRepository(Comment);

    const target = await repo.findOne({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException(
        `${targetType} with ID ${targetId} not found`,
      );
    }
  }

  private async addLike(
    userId: string,
    targetId: string,
    targetType: LikeTargetType,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const like = manager.create(Like, { userId, targetId, targetType });
      await manager.save(like);

      if (targetType === LikeTargetType.QUESTION) {
        await manager.increment(Question, { id: targetId }, 'likeCount', 1);
      } else {
        await manager.increment(Comment, { id: targetId }, 'likeCount', 1);
      }
    });
  }

  private async removeLike(
    like: Like,
    targetId: string,
    targetType: LikeTargetType,
  ) {
    return this.dataSource.transaction(async (manager) => {
      await manager.remove(like);

      if (targetType === LikeTargetType.QUESTION) {
        await manager.decrement(Question, { id: targetId }, 'likeCount', 1);
      } else {
        await manager.decrement(Comment, { id: targetId }, 'likeCount', 1);
      }
    });
  }
}
