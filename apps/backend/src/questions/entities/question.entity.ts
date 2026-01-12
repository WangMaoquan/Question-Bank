import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {
  QuestionType,
  QuestionDifficulty,
  QuestionStatus,
  QuestionOption,
} from '@question-bank/types';
import { User } from '../../users/user.entity';
import { Category } from '../../categories/category.entity';
import { Tag } from '../../tags/tag.entity';
import { PracticeRecord } from '../../practice/entities/practice-record.entity';
import { Favorite } from '../../practice/entities/favorite.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  options?: QuestionOption[];

  @Column({ type: 'jsonb' })
  answer: any;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ type: 'enum', enum: QuestionDifficulty })
  difficulty: QuestionDifficulty;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags?: Tag[];

  @Column()
  createdBy: string;

  @ManyToOne(() => User)
  creator?: User;

  @Column({ default: true })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.PUBLISHED,
  })
  status: QuestionStatus;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @Column({ default: 0 })
  answerCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  correctRate: number;

  @OneToMany(() => PracticeRecord, (record) => record.question)
  practiceRecords: PracticeRecord[];

  @OneToMany(() => Favorite, (favorite) => favorite.question)
  favorites: Favorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
