import { AxiosInstance } from 'axios';
import {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  CreateLikeDto,
  LikeTargetType,
  Like,
  CreateReportDto,
  Report,
} from '@question-bank/types';

export class CommunityApi {
  constructor(private client: AxiosInstance) {}

  // Comments
  async getComments(questionId: string): Promise<Comment[]> {
    return this.client.get('/comments', { params: { questionId } });
  }

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return this.client.post('/comments', data);
  }

  async updateComment(id: string, data: UpdateCommentDto): Promise<Comment> {
    return this.client.patch(`/comments/${id}`, data);
  }

  async deleteComment(id: string): Promise<void> {
    return this.client.delete(`/comments/${id}`);
  }

  // Likes
  async toggleLike(data: CreateLikeDto): Promise<{ isLiked: boolean; count: number }> {
    return this.client.post('/likes', data);
  }

  async getLikeStatus(targetId: string, targetType: LikeTargetType): Promise<{ isLiked: boolean }> {
    return this.client.get('/likes/status', { params: { targetId, targetType } });
  }

  // Reports
  async createReport(data: CreateReportDto): Promise<Report> {
    return this.client.post('/reports', data);
  }
}
