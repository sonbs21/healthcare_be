import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SelectDoctorDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: '' })
  doctorId?: string;
}