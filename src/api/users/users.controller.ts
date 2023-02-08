import { UsersService } from '@api/users/users.service';
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser } from '@decorators';
import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller('v1/user')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get('me')
  getMe(@CurrentUser() user) {
    return this.usersService.getMe(user['id']);
  }


}
