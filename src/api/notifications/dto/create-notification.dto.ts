/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {  Prisma, TypeNotification } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationsDto implements Prisma.NotificationCreateInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: TypeNotification.SYSTEM })
  typeNotification?: TypeNotification;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  title?: string;

}
