/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxDate } from 'class-validator';
import * as moment from 'moment';

export class CreateHealthRecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  height?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  weight?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  heartRateIndicator?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  systolic?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  diastolic?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  glucose?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  cholesterol?: string;
}


export class CreateHealthRecordCareDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  height?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  weight?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  heartRateIndicator?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  systolic?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  diastolic?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  glucose?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  cholesterol?: string;

  @IsDate()
  @IsOptional()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiPropertyOptional({ example: moment().utcOffset(7, true).toDate() })
  dateRecord: Date;
}
