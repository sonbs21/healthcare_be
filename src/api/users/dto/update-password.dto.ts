import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(6, { message: 'Mật khẩu ít nhất 6 ký tự' })
  // @MaxLength(255)
  @ApiProperty({ example: 'newPassword123' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(6, { message: 'Mật khẩu ít nhất 6 ký tự' })
  // @MaxLength(255)
  @ApiProperty({ example: 'newPassword123' })
  confirmNewPassword: string;
}
