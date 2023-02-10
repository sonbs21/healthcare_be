/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHeartBeatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  healthRecordId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  heartRateIndicator?: string;
}
