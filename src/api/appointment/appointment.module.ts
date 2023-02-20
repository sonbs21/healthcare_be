/* eslint-disable prettier/prettier */
import { SocketGateWayModule } from '@api/socket-io/socket-io.module';
import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [SocketGateWayModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
