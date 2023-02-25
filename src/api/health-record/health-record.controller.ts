/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import {
  Body,
  Controller,
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
import { FilterHealthRecordDto } from './dto';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
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
  findAll(@Query() dto: FilterHealthRecordDto, @Paginate() pagination: Pagination, @Headers() header) {
    return this.healthRecordService.findAll(dto, pagination);
  }

  @Get('health-record/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.healthRecordService.findOne(id);
  }

  @Post('health-record')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateHealthRecordDto) {
    return this.healthRecordService.create(user['memberId'], dto);
  }

  @Get('health-record-day')
  @HttpCode(HttpStatus.OK)
  findHealthRecordDay(@CurrentUser() user) {
    return this.healthRecordService.findHealthRecordDay(user['memberId']);
  }

  @Patch('health-record/:id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: CreateHealthRecordDto) {
    return this.healthRecordService.create(user['memberId'], dto);
  }

  // @Patch('feature/:id')
  // @HttpCode(HttpStatus.OK)
  // update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateFeatureDto, @Headers() header) {
  //   return this.featuresService.update(user['id'], id, dto, header['language']);
  // }

  // @Delete('feature/:id')
  // @HttpCode(HttpStatus.OK)
  // remove(@CurrentUser() user, @Param('id') id: string, @Headers() header) {
  //   return this.featuresService.remove(user['id'], id, header['language']);
  // }
}
