/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FilterBmiDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  ids?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  healthRecordIds?: string;

  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  isAll?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiPropertyOptional({ example: 10 })
  pageSize?: number;
}
