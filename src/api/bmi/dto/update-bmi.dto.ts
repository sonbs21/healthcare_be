/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBmiDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  height?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  weight?: string;


}
