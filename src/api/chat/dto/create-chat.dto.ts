import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

class Attachment {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'image' })
  type?: string;
}

export class PostMessageDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '' })
  content?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: [
      {
        type: 'image',
        url: 'https://url.image/test.png',
      },
    ],
  })
  attachment?: Attachment[];
}
