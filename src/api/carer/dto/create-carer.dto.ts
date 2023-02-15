/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarerlDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  fullName?: string;
}
