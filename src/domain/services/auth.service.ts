import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import { compareSync } from 'bcryptjs';

import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { PasswordReset } from '../entities/password-reset.entity';

import { LoginDto } from '../../application/dtos/auth/login.dto';
import { RegisterDto } from '../../application/dtos/auth/register.dto';
import { ResetPasswordDto } from '../../application/dtos/auth/reset-password.dto';
import { ForgotPasswordDto } from '../../application/dtos/auth/forgot-password.dto';
import { LoginWithIdDto } from '../../application/dtos/auth/login-with-id.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !compareSync(password, user.password)) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `The credentials does not match in our records.`,
          error: 'Unauthorized',
        }),
      );
    }

    return user;
  }

  async loginWithId(loginWithIdDto: LoginWithIdDto) {
    const { id } = loginWithIdDto;
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `The credentials does not match in our records.`,
          error: 'Unauthorized',
        }),
      );
    }

    return user;
  }

  async register(registerDto: RegisterDto) {
    return 'asd';
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    return 'asd';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return 'asd';
  }
}
