import { AxiosInstance } from 'axios';
import {
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionQueryDto,
  Category,
  CreateCategoryDto,
  Tag,
  CreateTagDto,
} from '@question-bank/types';

interface PaginationResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export class QuestionsApi {
  constructor(private client: AxiosInstance) {}

  // Questions
  async findAll(params?: QuestionQueryDto): Promise<PaginationResponse<Question>> {
    return this.client.get('/questions', { params });
  }

  async findOne(id: string): Promise<Question> {
    return this.client.get(`/questions/${id}`);
  }

  async create(data: CreateQuestionDto): Promise<Question> {
    return this.client.post('/questions', data);
  }

  async update(id: string, data: UpdateQuestionDto): Promise<Question> {
    return this.client.patch(`/questions/${id}`, data);
  }

  async remove(id: string): Promise<void> {
    return this.client.delete(`/questions/${id}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.client.get('/categories');
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.client.post('/categories', data);
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDto>): Promise<Category> {
    return this.client.patch(`/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.client.delete(`/categories/${id}`);
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return this.client.get('/tags');
  }

  async createTag(data: CreateTagDto): Promise<Tag> {
    return this.client.post('/tags', data);
  }

  async deleteTag(id: string): Promise<void> {
    return this.client.delete(`/tags/${id}`);
  }
}
