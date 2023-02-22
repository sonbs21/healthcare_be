/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import * as moment from 'moment';

export class FilterAppointmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  ids?: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  endDate?: Date;

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
