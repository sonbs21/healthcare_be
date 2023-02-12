/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { BloodPressureService } from './blood-pressure.service';
import { CreateBloodPressureDto, UpdateBloodPressureDto } from './dto';

@Controller('v1')
@ApiTags('Blood Pressure')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BloodPressureController {
  constructor(private readonly bloodPressureService: BloodPressureService) {}

  @Get('blood-pressures')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: any, @Paginate() pagination: Pagination) {
    return this.bloodPressureService.findAll(dto, pagination);
  }

  @Get('blood-pressure/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bloodPressureService.findOne(id);
  }

  @Get('get-blood-pressure')
  @HttpCode(HttpStatus.OK)
  getBloodPressure(@CurrentUser() user, @Paginate() pagination: Pagination) {
    return this.bloodPressureService.getBloodPressure(user['memberID'], pagination);
  }

  @Post('blood-pressure')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateBloodPressureDto) {
    return this.bloodPressureService.create(user['memberID'], dto);
  }

  @Patch('blood-pressure/:id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateBloodPressureDto) {
    return this.bloodPressureService.update(user['memberId'], id, dto);
  }

  @Delete('blood-pressure/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string, @Headers() header) {
    return this.bloodPressureService.delete(user['memberId'], id);
  }
}
