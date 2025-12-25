/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * User entity
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  contributionScore: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation DTO
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

/**
 * User login DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * User update DTO
 */
export interface UpdateUserDto {
  username?: string;
  avatar?: string;
  bio?: string;
}

/**
 * JWT payload
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}
