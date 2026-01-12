import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req, // Changed from Request to Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, UserRole } from '@question-bank/types'; // Added UserRole
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express'; // Added Request from express

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    // Changed type to AuthenticatedRequest and decorator to @Req
    return req.user; // Removed eslint-disable comments
  }
}
