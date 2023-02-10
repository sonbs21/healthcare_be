/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, TypeNotification } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto implements Prisma.NotificationUpdateInput {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  userId?: string;

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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  isRead?: boolean;
}
