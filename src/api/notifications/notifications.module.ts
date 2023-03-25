/* eslint-disable prettier/prettier */
import { NotificationsController } from '@api/notifications/notifications.controller';
import { NotificationsService } from '@api/notifications/notifications.service';
import { SocketGateWayModule } from '@api/socket-io/socket-io.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SocketGateWayModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
