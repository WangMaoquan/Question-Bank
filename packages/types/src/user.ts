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
