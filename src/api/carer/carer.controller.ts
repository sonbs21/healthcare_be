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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { CarerService } from './carer.service';
import { CreateCarerlDto, FilterCarerDto, UpdateCarerDto } from './dto';

@Controller('v1')
@ApiTags('Carer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarerController {
  constructor(private readonly carerService: CarerService) {}

  @Get('carers')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: FilterCarerDto, @Paginate() pagination: Pagination) {
    return this.carerService.findAll(dto, pagination);
  }

  @Get('carer/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.carerService.findOne(id);
  }

  @Get('get-carer')
  @HttpCode(HttpStatus.OK)
  getCarer(@CurrentUser() user, @Paginate() pagination: Pagination) {
    return this.carerService.getCarer(user['memberID'], pagination);
  }

  @Post('carer')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateCarerlDto) {
    return this.carerService.create(user['memberID'],dto);
  }

  @Patch('carer/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateCarerDto,
  ) {
    return this.carerService.update(user['memberId'],id,dto);
  }

  @Delete('carer/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.carerService.delete(user['memberId'],id);
  }
}
