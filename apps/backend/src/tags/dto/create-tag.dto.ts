import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: '标签名称', example: 'React' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '标签颜色', required: false, example: '#61dafb' })
  @IsOptional()
  @IsString()
  color?: string;
}
