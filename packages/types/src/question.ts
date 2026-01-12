/**
 * Question type enumeration
 */
export enum QuestionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  JUDGE = 'judge',
  FILL = 'fill',
  SHORT = 'short',
  CODING = 'coding',
}

/**
 * Question difficulty enumeration
 */
export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * Question status enumeration
 */
export enum QuestionStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  UNDER_REVIEW = 'under_review',
}

/**
 * Question option (for choice questions)
 */
export interface QuestionOption {
  key: string;
  value: string;
}

/**
 * Question answer type
 */
export type QuestionAnswer = string | string[] | boolean | Record<string, unknown>;

/**
 * Question entity
 */
export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  content: string;
  options?: QuestionOption[];
  answer: QuestionAnswer;
  explanation?: string;
  difficulty: QuestionDifficulty;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  createdBy: string;
  creator?: {
    id: string;
    username: string;
    avatar?: string;
  };
  isPublic: boolean;
  status: QuestionStatus;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  answerCount: number;
  correctRate: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create question DTO
 */
export interface CreateQuestionDto {
  type: QuestionType;
  title: string;
  content: string;
  options?: QuestionOption[];
  answer: any;
  explanation?: string;
  difficulty: QuestionDifficulty;
  categoryId?: string;
  tagIds?: string[];
  isPublic: boolean;
}

/**
 * Update question DTO
 */
export interface UpdateQuestionDto {
  title?: string;
  content?: string;
  options?: QuestionOption[];
  answer?: QuestionAnswer;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  categoryId?: string;
  tagIds?: string[];
  isPublic?: boolean;
  status?: QuestionStatus;
}

/**
 * Question query parameters
 */
export interface QuestionQueryDto {
  page?: number;
  limit?: number;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  categoryId?: string;
  tagIds?: string[];
  search?: string;
  isPublic?: boolean;
  createdBy?: string;
  sortBy?: 'createdAt' | 'viewCount' | 'likeCount' | 'correctRate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Category entity
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Category DTO
 */
export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}

/**
 * Tag entity
 */
export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

/**
 * Create Tag DTO
 */
export interface CreateTagDto {
  name: string;
  color?: string;
}
