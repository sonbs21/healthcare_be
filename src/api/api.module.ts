
import { LoginUserModule } from '@api/login/login.module';

import { UsersModule } from '@api/users/users.module';
import { Module } from '@nestjs/common';
import { BmiModule } from './bmi/bmi.module';
import { ConversationModule } from './conversation/conversation.module';
import { DoctorModule } from './doctor/doctor.module';
import { HealthRecordModule } from './healthRecord/health-record.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    DoctorModule,
    LoginUserModule,
    PatientModule,
    UsersModule,
    HealthRecordModule,
    ConversationModule,
    BmiModule
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}
