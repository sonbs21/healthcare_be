/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HeartbeatController } from './heartbeat.controller';
import { HeartbeartService } from './heartbeat.service';

@Module({
  imports: [],
  controllers: [HeartbeatController],
  providers: [HeartbeartService],
  exports: [HeartbeartService],
})
export class BmiModule {}
