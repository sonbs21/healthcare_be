/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBmiDto {
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
}
