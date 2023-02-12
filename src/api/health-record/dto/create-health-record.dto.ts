/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthRecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  healthRecordId?: string;

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
