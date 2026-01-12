import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { PracticeRecord } from './entities/practice-record.entity';
import { Favorite } from './entities/favorite.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeRecord, Favorite]),
    QuestionsModule, // Import QuestionsModule to access QuestionsService
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule {}
