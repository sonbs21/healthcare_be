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
import { CholesterolService } from './cholesterol.service';
import { CreateCholesterolDto, UpdateCholesterolDto } from './dto';

@Controller('v1')
@ApiTags('Cholesterol')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CholesterolController {
  constructor(private readonly cholesterolService: CholesterolService) {}

  @Get('cholesterols')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: any, @Paginate() pagination: Pagination) {
    return this.cholesterolService.findAll(dto, pagination);
  }

  @Get('cholesterol/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.cholesterolService.findOne(id);
  }

  @Post('cholesterol')
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user, @Body() dto: CreateCholesterolDto) {
    return this.cholesterolService.create(user['memberID'],dto);
  }

  @Patch('cholesterol/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() dto: UpdateCholesterolDto,
  ) {
    return this.cholesterolService.update(user['memberId'],id,dto);
  }

  @Delete('cholesterol/:id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.cholesterolService.delete(user['memberId'],id);
  }
}
