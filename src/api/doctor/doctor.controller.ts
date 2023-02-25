/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { DoctorService } from './doctor.service';
import { FilterDoctorsDto, FilterPatientsWithDoctorIdDto, UpdateDoctorDto } from './dto';

@Controller('v1')
@ApiTags('Doctors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('doctors')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: FilterDoctorsDto, @Paginate() pagination: Pagination) {
    return this.doctorService.findAll(dto, pagination);
  }
  @Get('doctor/patients')
  @HttpCode(HttpStatus.OK)
  getAllPatient(@CurrentUser() user, @Query() dto: FilterPatientsWithDoctorIdDto, @Paginate() pagination: Pagination) {
    return this.doctorService.getAllPatient(user['memberId'], dto, pagination);
  }
  @Get('doctor/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Patch('doctor/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }
}
