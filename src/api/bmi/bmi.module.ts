/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BmiController } from './bmi.controller';
import { BmiService } from './bmi.service';

@Module({
  imports: [],
  controllers: [BmiController],
  providers: [BmiService],
  exports: [BmiService],
})
export class BmiModule {}
