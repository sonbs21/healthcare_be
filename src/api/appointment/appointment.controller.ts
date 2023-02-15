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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, FilterAppointmentDto, UpdateAppointmentDto } from './dto';

@Controller('v1')
@ApiTags('Appointment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('appointments')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: FilterAppointmentDto, @Paginate() pagination: Pagination) {
    return this.appointmentService.findAll(dto, pagination);
  }

  @Get('appointment/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Get('get-appointment-doctor')
  @HttpCode(HttpStatus.OK)
  getAppointmentDoctor(@CurrentUser() user, @Query() dto: FilterAppointmentDto, @Paginate() pagination: Pagination) {
    return this.appointmentService.getAppointmentDoctor(user['memberID'], dto, pagination);
  }
  @Get('get-appointment-patient')
  @HttpCode(HttpStatus.OK)
  getAppointmentPatient(@CurrentUser() user, @Query() dto: FilterAppointmentDto, @Paginate() pagination: Pagination) {
    return this.appointmentService.getAppointmentPatient(user['memberID'], dto, pagination);
  }
  @Post('appointment')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(user['memberID'], dto);
  }

  @Patch('appointment/:id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(user['memberId'], id, dto);
  }

  @Delete('appointment/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.appointmentService.delete(user['memberId'], id);
  }
}
