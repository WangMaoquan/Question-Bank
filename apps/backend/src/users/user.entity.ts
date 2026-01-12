import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '@question-bank/types';
import { Question } from '../questions/entities/question.entity';
import { PracticeRecord } from '../practice/entities/practice-record.entity';
import { Favorite } from '../practice/entities/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false }) // 默认不查询密码
  passwordHash: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Question, (question) => question.creator)
  questions: Question[];

  @OneToMany(() => PracticeRecord, (record) => record.user)
  practiceRecords: PracticeRecord[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @Column({ default: 0 })
  contributionScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
