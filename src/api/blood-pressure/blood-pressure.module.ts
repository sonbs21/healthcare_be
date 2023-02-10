/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BloodPressureController } from './blood-pressure.controller';
import { BloodPressureService } from './blood-pressure.service';

@Module({
  imports: [],
  controllers: [BloodPressureController],
  providers: [BloodPressureService],
  exports: [BloodPressureService],
})
export class BmiModule {}
