/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, MaxDate } from 'class-validator';
import * as moment from 'moment';


export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  fullName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  phone?: string;

  @IsDate()
  @IsNotEmpty()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiProperty({ example: moment().utcOffset(7, true).toDate() })
  dateOfBirth?: Date;

  @IsDate()
  @IsNotEmpty()
  @MaxDate(moment().subtract(1, 'days').utcOffset(7, true).toDate())
  @ApiProperty({ example: moment().utcOffset(7, true).toDate() })
  dateMeeting?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  notes?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  timeMeeting?: string;
}
