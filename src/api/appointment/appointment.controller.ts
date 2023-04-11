/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, FilterAppointmentDto, GetTimeAppointmentDto, UpdateAppointmentDto } from './dto';

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
    return this.appointmentService.getAppointmentDoctor(user['memberId'], dto, pagination);
  }
  @Get('get-appointment-patient')
  @HttpCode(HttpStatus.OK)
  getAppointmentPatient(@CurrentUser() user, @Query() dto: FilterAppointmentDto, @Paginate() pagination: Pagination) {
    return this.appointmentService.getAppointmentPatient(user['memberId'], dto, pagination);
  }

  @Get('appointment-time')
  @HttpCode(HttpStatus.OK)
  getAppointmentTime(@Query() dto: GetTimeAppointmentDto) {
    return this.appointmentService.getTimeAppointment(dto);
  }

  @Post('appointment')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(user['memberId'], dto);
  }

  @Post('appointment-doctor')
  @HttpCode(HttpStatus.CREATED)
  post(@CurrentUser() user, @Param('id') id: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.post(user['memberId'], id, dto);
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

  @Put('appointment/:id/approve')
  @HttpCode(HttpStatus.OK)
  approve(@CurrentUser() user, @Param('id') id: string) {
    return this.appointmentService.approve(user['memberId'], id);
  }

  @Put('appointment/:id/refuse')
  @HttpCode(HttpStatus.OK)
  refuse(@CurrentUser() user, @Param('id') id: string) {
    return this.appointmentService.refuse(user['memberId'], id);
  }

  @Put('appointment/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser() user, @Param('id') id: string) {
    return this.appointmentService.cancel(user['memberId'], id);
  }

  @Put('appointment/:id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@CurrentUser() user, @Param('id') id: string) {
    return this.appointmentService.complete(user['memberId'], id);
  }
}
