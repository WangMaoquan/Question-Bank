import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum LikeTargetType {
  QUESTION = 'question',
  COMMENT = 'comment',
}

@Entity('likes')
@Unique(['userId', 'targetId', 'targetType'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  targetId: string;

  @Column({ type: 'enum', enum: LikeTargetType })
  targetType: LikeTargetType;

  @CreateDateColumn()
  createdAt: Date;
}
