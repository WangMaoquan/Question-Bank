/**
 * 通用 API 响应接口
 */
export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}

/**
 * 分页元数据
 */
export interface PaginationMeta {
  total: number; // 总条数
  page: number; // 当前页码
  limit: number; // 每页条数
  totalPages: number; // 总页数
  hasNextPage: boolean; // 是否有下一页
  hasPreviousPage: boolean; // 是否有上一页
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  items: T[]; // 数据列表
  meta: PaginationMeta; // 分页信息
}

/**
 * 排序方向
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * 基础查询 DTO
 */
export interface BaseQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}
