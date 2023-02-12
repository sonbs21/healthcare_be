/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCholesterolDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  cholesterol?: string;
}
