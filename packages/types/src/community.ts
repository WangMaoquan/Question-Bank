/**
 * Comment entity
 */
export interface Comment {
  id: string;
  questionId: string;
  userId: string;
  user?: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create comment DTO
 */
export interface CreateCommentDto {
  questionId: string;
  content: string;
  parentId?: string;
}

/**
 * Update comment DTO
 */
export interface UpdateCommentDto {
  content: string;
}

/**
 * Like target type
 */
export enum LikeTargetType {
  QUESTION = 'question',
  COMMENT = 'comment',
}

/**
 * Like entity
 */
export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: LikeTargetType;
  createdAt: Date;
}

/**
 * Create like DTO
 */
export interface CreateLikeDto {
  targetId: string;
  targetType: LikeTargetType;
}

/**
 * Report reason type
 */
export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

/**
 * Report entity
 */
export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: LikeTargetType;
  reason: string;
  status: ReportStatus;
  handledBy?: string;
  handledAt?: Date;
  createdAt: Date;
}

/**
 * Create report DTO
 */
export interface CreateReportDto {
  targetId: string;
  targetType: LikeTargetType;
  reason: string;
}
