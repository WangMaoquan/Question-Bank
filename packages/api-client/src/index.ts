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

export interface ApiRequestConfig extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
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
      async (error: AxiosError) => {
        const config = error.config as ApiRequestConfig;

        // Retry logic
        if (config && config.retry && config.retry > 0 && config.method === 'get') {
          config.retry -= 1;
          const delay = config.retryDelay || 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.client(config);
        }

        if (error.response?.status === 401) {
          this.config.onUnauthorized?.();
        }
        this.config.onError?.(error);
        return Promise.reject(error);
      }
    );
  }

  // Helper for file upload
  public async upload<T = any>(
    url: string,
    file: File,
    fieldName = 'file',
    additionalData?: Record<string, any>,
    config?: ApiRequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Generic request methods
  public get<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}
