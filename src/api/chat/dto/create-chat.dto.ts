import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeMessage } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostMessageDto {
  @IsEnum(TypeMessage)
  @IsNotEmpty()
  @ApiProperty({ example: TypeMessage.TEXT })
  typeMessage?: TypeMessage;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  content?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: [''],
  })
  file?: string[];
}
