import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from '../../domain/services/auth.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { RegisterDto } from '../dtos/auth/register.dto';
import { ForgotPasswordDto } from '../dtos/auth/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/auth/reset-password.dto';
import { LoginWithIdDto } from '../dtos/auth/login-with-id.dto';

import { User } from '../../domain/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @MessagePattern('authLogin')
  async login(@Payload() loginDto: LoginDto): Promise<User> {
    return this.authService.login(loginDto);
  }

  @MessagePattern('authLoginWithId')
  async loginWithId(@Payload() loginWithId: LoginWithIdDto): Promise<User> {
    return this.authService.loginWithId(loginWithId);
  }

  @MessagePattern('authRegister')
  async register(@Payload() registerDto: RegisterDto): Promise<string> {
    return await this.authService.register(registerDto);
  }

  @MessagePattern('authForgotPassword')
  async forgotPassword(
    @Payload() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern('authResetPassword')
  async resetPassword(
    @Payload() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
