/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCarerDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  fullName?: string;
}
