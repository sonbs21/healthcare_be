/* eslint-disable prettier/prettier */
import { NotificationsService } from '@api/notifications/notifications.service';
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import {
  CreateNotificationsDto,
  FilterNotificationsDto,
  UpdateNotificationDto,
} from './dto';

@Controller('v1')
@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('notifications')
  @HttpCode(HttpStatus.OK)
  findAll(
    @CurrentUser() user,
    @Query() dto: FilterNotificationsDto,
    @Paginate() pagination: Pagination,
  ) {
    return this.notificationsService.findAll(
      user['memberId'],
      dto,
      pagination,
    );
  }

  @Get('notification/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post('notification')
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user,
    @Body() dto: CreateNotificationsDto,
  ) {
    return this.notificationsService.create(
      user['memberId'],
      dto,
    );
  }

  @Patch('notification/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(
      user['memberId'],
      id,
      dto,
    );
  }

  @Put('notification/:id/read')
  @HttpCode(HttpStatus.OK)
  read(@CurrentUser() user, @Param('id') id: string) {
    return this.notificationsService.read(user['memberId'], id);
  }

  @Put('notification/read-all')
  @HttpCode(HttpStatus.OK)
  readAll(@CurrentUser() user) {
    return this.notificationsService.readAll(user['memberId']);
  }


  @Delete('notification/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.notificationsService.remove(user['memberId'], id);
  }
}
