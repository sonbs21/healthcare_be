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
import { CreateGlucoseDto, UpdateGlucoseDto } from './dto';
import { GlucoseService } from './glucose.service';

@Controller('v1')
@ApiTags('Glucose')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GlucoseController {
  constructor(private readonly glucoseService: GlucoseService) {}

  @Get('glucoses')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: any, @Paginate() pagination: Pagination) {
    return this.glucoseService.findAll(dto, pagination);
  }

  @Get('glucose/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.glucoseService.findOne(id);
  }

  @Post('glucose')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateGlucoseDto) {
    return this.glucoseService.create(user['memberID'],dto);
  }

  @Patch('glucose/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateGlucoseDto,
  ) {
    return this.glucoseService.update(user['memberId'],id,dto);
  }

  @Delete('glucose/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.glucoseService.delete(user['memberId'],id);
  }
}
