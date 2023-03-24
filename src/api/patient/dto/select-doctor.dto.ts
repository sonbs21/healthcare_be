import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SelectDoctorDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: '' })
  doctorId?: string;
}

export class RatingDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: '' })
  doctorId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({ example: 1 })
  rating?: number;
}
