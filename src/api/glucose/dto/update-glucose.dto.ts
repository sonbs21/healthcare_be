/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGlucoseDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  glucose?: string;
}
