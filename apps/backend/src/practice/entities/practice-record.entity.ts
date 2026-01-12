import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Question } from '../../questions/entities/question.entity';
import type { QuestionAnswer } from '@question-bank/types';

@Entity('practice_records')
export class PracticeRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.practiceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  questionId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'jsonb', nullable: true })
  userAnswer: QuestionAnswer;

  @Column()
  isCorrect: boolean;

  @Column({ type: 'int', default: 0, comment: 'Time spent in seconds' })
  timeSpent: number;

  @CreateDateColumn()
  createdAt: Date;
}
