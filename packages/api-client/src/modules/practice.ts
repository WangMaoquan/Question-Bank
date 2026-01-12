import { AxiosInstance } from 'axios';
import { PracticeRecord, SubmitAnswerDto, PracticeStats, Favorite } from '@question-bank/types';

export class PracticeApi {
  constructor(private client: AxiosInstance) {}

  async submitAnswer(data: SubmitAnswerDto): Promise<PracticeRecord> {
    return this.client.post('/practice/submit', data);
  }

  async getRecords(): Promise<PracticeRecord[]> {
    return this.client.get('/practice/records');
  }

  async getStats(): Promise<PracticeStats> {
    // Assuming backend endpoint exists
    return this.client.get('/practice/stats');
  }

  // Favorites
  async addFavorite(questionId: string): Promise<Favorite> {
    return this.client.post('/practice/favorites', { questionId });
  }

  async removeFavorite(questionId: string): Promise<void> {
    return this.client.delete(`/practice/favorites/${questionId}`);
  }

  async getFavorites(): Promise<Favorite[]> {
    return this.client.get('/practice/favorites');
  }
}
