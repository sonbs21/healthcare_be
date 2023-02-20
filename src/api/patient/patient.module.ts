import { SocketGateWayModule } from '@api/socket-io/socket-io.module';
import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [SocketGateWayModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
