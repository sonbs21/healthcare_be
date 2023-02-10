/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBloodPressureDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  systolic?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  diastolic?: string;
}
