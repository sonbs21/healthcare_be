/* eslint-disable prettier/prettier */
import { LoginUserService } from '@api/login/login.service';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '@auth/guards';
import { CurrentUser } from '@decorators';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterDoctorDto,
  RegisterPatientDto,
  ResetPasswordDto,
} from './dto';

@Controller('v1/auth')
@ApiTags('Login User')
export class LoginUserController {
  constructor(private readonly loginUserService: LoginUserService) {}

  @Get('user/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() user, @Request() req) {
    return this.loginUserService.refresh(user, req['refreshToken']);
  }

  @Post('user/login')
  @ApiBody({ type: () => LoginUserDto })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.loginUserService.login(dto);
  }

  @Post('user/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user) {
    return this.loginUserService.logout(user);
  }

  @Post('user/register/doctor')
  @HttpCode(HttpStatus.CREATED)
  registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.loginUserService.registerDoctor(dto);
  }

  @Post('user/register/patient')
  @HttpCode(HttpStatus.CREATED)
  registerPatient(@Body() dto: RegisterPatientDto) {
    return this.loginUserService.registerPatient(dto);
  }

  // @Post('user/forgot-password')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // forgotPassword(@Body() dto: ForgotPasswordDto) {
  //   return this.loginUserService.forgotPassword(dto);
  // }

  // @Post('user/reset-password')
  // @HttpCode(HttpStatus.OK)
  // resetPassword(@Body() dto: ResetPasswordDto) {
  //   return this.loginUserService.resetPassword(dto);
  // }
}
