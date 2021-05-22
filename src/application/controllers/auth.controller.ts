import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { RegisterDto } from '../dtos/auth/register.dto';
import { ForgotPasswordDto } from '../dtos/auth/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/auth/reset-password.dto';
import { LoginWithIdDto } from '../dtos/auth/login-with-id.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @MessagePattern('authLogin')
  login(@Payload('value') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('authLoginWithId')
  loginWithId(@Payload('value') loginWithId: LoginWithIdDto) {
    return this.authService.loginWithId(loginWithId);
  }

  @MessagePattern('authRegister')
  register(@Payload('value') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('authForgotPassword')
  forgotPassword(@Payload('value') forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern('authResetPassword')
  resetPassword(@Payload('value') resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
