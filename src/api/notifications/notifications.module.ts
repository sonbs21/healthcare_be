/* eslint-disable prettier/prettier */
import { NotificationsController } from '@api/notifications/notifications.controller';
import { NotificationsService } from '@api/notifications/notifications.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
