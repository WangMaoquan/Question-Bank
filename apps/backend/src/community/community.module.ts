import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Like]),
    QuestionsModule, // Needed to verify questions exist
  ],
  controllers: [CommentsController, LikesController],
  providers: [CommentsService, LikesService],
  exports: [CommentsService, LikesService],
})
export class CommunityModule {}
