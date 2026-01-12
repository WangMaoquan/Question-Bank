import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('用户 (Users)')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 用户相关的 CRUD 可以在这里添加，目前主要由 Auth 模块调用 Service
}
