/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHeartbeatDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  heartRateIndicator?: string;
}
