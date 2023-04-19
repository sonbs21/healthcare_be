/* eslint-disable prettier/prettier */
import { UsersService } from '@api/users/users.service';
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser } from '@decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, UpdatePasswordDto } from './dto';
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
}
