/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CarerController } from './carer.controller';
import { CarerService } from './carer.service';

@Module({
  imports: [],
  controllers: [CarerController],
  providers: [CarerService],
  exports: [CarerService],
})
export class CarerModule {}
