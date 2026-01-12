import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户邮箱', example: 'newuser@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '用户名', example: 'NewUser' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '密码(至少6位)', example: 'newpassword123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
