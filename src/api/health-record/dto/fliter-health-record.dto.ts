/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterHealthRecordDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: Status.SAFE })
  status?: Status;

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

export class Position {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  lat?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  lng?: string;
}

export class ResultSearch {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  resultSearch?: string;
}
