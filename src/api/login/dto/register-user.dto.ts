import { Gender } from '@enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class RegisterDoctorDto {
  @IsString()
  @Transform(({ obj, key }) => obj[key]?.trim())
  @IsNotEmpty()
  @ApiProperty({ example: '0123456789' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123123' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  email: string;

  @IsString()
  @Transform(({ obj, key }) => obj[key]?.trim())
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  fullName: string;

  @IsDate()
  @IsNotEmpty()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiProperty({ example: moment().utcOffset(7, true).toDate() })
  dateOfBirth: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({ example: Gender.MALE })
  gender: Gender;

   @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  experience: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  workPlace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  specialize: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  description?: string;
}

export class RegisterPatientDto {
  @IsString()
  @Transform(({ obj, key }) => obj[key]?.trim())
  @IsNotEmpty()
  @ApiProperty({ example: '0123456789' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123123' })
  password: string;


  @IsString()
  @Transform(({ obj, key }) => obj[key]?.trim())
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  fullName: string;

  @IsDate()
  @IsNotEmpty()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiProperty({ example: moment().utcOffset(7, true).toDate() })
  dateOfBirth: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({ example: Gender.MALE })
  gender: Gender;

   @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  address: string;

 }
