/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';


export class UpdateDoctorDto {
  // @IsString()
  // @IsOptional()
  // @MinLength(1)
  // @ApiPropertyOptional({ example: '' })
  // code: string;

  @IsString()
  @Transform(({ obj, key }) => obj[key]?.trim())
  @IsOptional()
  @MinLength(1)
  @ApiPropertyOptional({ example: '' })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  experience?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  workPlace?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  specialize?: string;
}
