import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePatientDto {
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
  job?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  insuranceNumber?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  medicalHistory?: string;
}
