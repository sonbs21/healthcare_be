/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { FilterHealthRecordDto, Position, ResultSearch } from './dto';
import { CreateHealthRecordCareDto, CreateHealthRecordDto } from './dto/create-health-record.dto';
import { HealthRecordService } from './health-record.service';

@Controller('v1')
@ApiTags('HealthRecord')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  @Get('health-record-member')
  @HttpCode(HttpStatus.OK)
  findHealthRecordWithId(@CurrentUser() user, @Query() dto: FilterHealthRecordDto, @Paginate() pagination: Pagination) {
    return this.healthRecordService.findHealthRecordWithId(user['memberId'], dto, pagination);
  }

  @Get('health-records')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: FilterHealthRecordDto, @Paginate() pagination: Pagination) {
    return this.healthRecordService.findAll(dto, pagination);
  }

  @Get('health-record')
  @HttpCode(HttpStatus.OK)
  findOne(@CurrentUser() user) {
    return this.healthRecordService.findOne(user['memberId']);
  }

  @Post('health-record')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateHealthRecordDto) {
    return this.healthRecordService.create(user['memberId'], dto);
  }

  @Post('health-record-care')
  @HttpCode(HttpStatus.CREATED)
  createCare(@CurrentUser() user, @Body() dto: CreateHealthRecordCareDto) {
    return this.healthRecordService.createCare(user['memberId'], dto);
  }

  @Post('emergency')
  @HttpCode(HttpStatus.OK)
  emergency(@CurrentUser() user, @Body() dto: Position) {
    return this.healthRecordService.emergency(user['memberId'], dto);
  }

  @Get('health-record-day')
  @HttpCode(HttpStatus.OK)
  findHealthRecordDay(@CurrentUser() user) {
    return this.healthRecordService.findHealthRecordDay(user['memberId']);
  }

  @Get('hospitals')
  @HttpCode(HttpStatus.OK)
  getHospitals(@Query() dto: Position) {
    return this.healthRecordService.getHospitals(dto);
  }

  @Get('resultSearch')
  @HttpCode(HttpStatus.OK)
  getPosition(@Query() dto: ResultSearch) {
    return this.healthRecordService.getPosition(dto);
  }

  @Patch('health-record/:id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: CreateHealthRecordDto) {
    return this.healthRecordService.create(user['memberId'], dto);
  }
}
