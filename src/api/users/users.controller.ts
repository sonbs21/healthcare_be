/* eslint-disable prettier/prettier */
import { UsersService } from '@api/users/users.service';
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser } from '@decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, UpdatePasswordDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('v1/user')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser() user) {
    return this.usersService.getMe(user['id']);
  }

  @Patch('change-password')
  @ApiNoContentResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(@CurrentUser() user, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user['id'], dto);
  }

  @Patch('update-password')
  @ApiNoContentResponse()
  updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(dto);
  }

  @Patch('avatar')
  @ApiNoContentResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  changeAvatar(@CurrentUser() user, @UploadedFile() file) {
    return this.usersService.changeAvatar(user['memberId'], file);
  }
}
