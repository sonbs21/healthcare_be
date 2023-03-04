import { SocketGateWayModule } from '@api/socket-io/socket-io.module';
import { Module } from '@nestjs/common';
import { HealthRecordController } from './health-record.controller';
import { HealthRecordService } from './health-record.service';

@Module({
  imports: [SocketGateWayModule],
  controllers: [HealthRecordController],
  providers: [HealthRecordService],
  exports: [HealthRecordService],
})
export class HealthRecordModule {}
