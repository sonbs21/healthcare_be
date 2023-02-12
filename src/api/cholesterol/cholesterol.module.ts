/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CholesterolController } from './cholesterol.controller';
import { CholesterolService } from './cholesterol.service';

@Module({
  imports: [],
  controllers: [CholesterolController],
  providers: [CholesterolService],
  exports: [CholesterolService],
})
export class CholesterolModule {}
