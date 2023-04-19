import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '0123456789' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '0123456789' })
  password: string;
}
