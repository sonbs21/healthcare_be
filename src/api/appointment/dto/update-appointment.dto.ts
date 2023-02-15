/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  fullName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  phone?: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ example: moment().utcOffset(7, true).toDate() })
  dateOfBirth: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ example: moment().utcOffset(7, true).toDate() })
  dateMeeting: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  notes?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  timeMeeting?: string;
}
