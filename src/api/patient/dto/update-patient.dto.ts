import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MaxDate, MinLength } from 'class-validator';
import * as moment from 'moment';
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

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional({ example: Gender.MALE })
  gender?: Gender;

  @IsDate()
  @IsOptional()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiPropertyOptional({ example: moment().utcOffset(7, true).toDate() })
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  job?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  phoneCarer?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  fullNameCarer?: string;
}
