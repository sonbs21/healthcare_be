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
import { BmiService } from './bmi.service';
import { CreateBmiDto, FilterBmiDto, FilterBmiGetMemberDto, UpdateBmiDto } from './dto';

@Controller('v1')
@ApiTags('Bmi')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BmiController {
  constructor(private readonly bmiService: BmiService) {}

  @Get('bmis')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: FilterBmiDto, @Paginate() pagination: Pagination) {
    return this.bmiService.findAll(dto, pagination);
  }

  @Get('bmi/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bmiService.findOne(id);
  }

  @Get('get-bmi')
  @HttpCode(HttpStatus.OK)
  getBmi(@CurrentUser() user, @Query() dto: FilterBmiGetMemberDto, @Paginate() pagination: Pagination) {
    return this.bmiService.getBmi(user['memberId'], dto, pagination);
  }

  @Post('bmi')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateBmiDto) {
    return this.bmiService.create(user['memberId'], dto);
  }

  @Patch('bmi/:id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateBmiDto) {
    return this.bmiService.update(user['memberId'], id, dto);
  }

  @Delete('bmi/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string, @Headers() header) {
    return this.bmiService.delete(user['memberId'], id);
  }
}
