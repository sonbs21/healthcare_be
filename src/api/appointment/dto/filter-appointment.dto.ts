/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAppointment } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterAppointmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  ids?: string;

  @IsEnum(StatusAppointment)
  @IsOptional()
  @ApiPropertyOptional({ example: StatusAppointment.CREATED })
  status?: StatusAppointment;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  timeDate?: Date;

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
