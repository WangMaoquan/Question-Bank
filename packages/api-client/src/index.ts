import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { AuthApi } from './modules/auth';
import { QuestionsApi } from './modules/questions';
import { PracticeApi } from './modules/practice';
import { CommunityApi } from './modules/community';

export * from './modules/auth';
export * from './modules/questions';
export * from './modules/practice';
export * from './modules/community';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  onUnauthorized?: () => void;
  onError?: (error: AxiosError) => void;
  getToken?: () => string | null;
}

export class ApiClient {
  private client: AxiosInstance;
  public auth: AuthApi;
  public questions: QuestionsApi;
  public practice: PracticeApi;
  public community: CommunityApi;

  constructor(private config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
    });

    this.setupInterceptors();

    this.auth = new AuthApi(this.client);
    this.questions = new QuestionsApi(this.client);
    this.practice = new PracticeApi(this.client);
    this.community = new CommunityApi(this.client);
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.config.getToken?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.config.onUnauthorized?.();
        }
        this.config.onError?.(error);
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods if needed directly
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}
