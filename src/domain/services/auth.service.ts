import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Brackets, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import * as moment from 'moment';
import { compareSync, genSalt, hash } from 'bcryptjs';

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
    @Inject('CLIENT_KAFKA')
    private readonly clientKafka: ClientKafka,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {}

  onModuleInit() {
    const patterns = ['createSendEmail'];

    for (const pattern of patterns) {
      this.clientKafka.subscribeToResponseOf(pattern);
    }
  }

  async login(loginDto: LoginDto): Promise<User> {
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

  async loginWithId(loginWithIdDto: LoginWithIdDto): Promise<User> {
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

  @Transactional()
  async register(registerDto: RegisterDto): Promise<User> {
    const { name, email, password, organization_name } = registerDto;

    const organization = await this.organizationRepository.save({
      name: organization_name,
    });

    const role = await this.roleRepository.save({
      organization_id: organization.id,
      name: 'Administrator',
      is_special: true,
    });

    const user = await this.userRepository.save({
      organization_id: organization.id,
      name,
      email,
      password: await hash(password, await genSalt(10)),
      role_id: role.id,
    });

    return await this.userRepository.findOne({ id: user.id });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<string> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The credentials does not match in our records.`,
          error: 'Bad Request',
        }),
      );
    }

    //delete expired password resets
    const expiredPasswordResets = await this.passwordResetRepository.find({
      where: {
        expired_at: Raw((alias) => `${alias} < NOW()`),
      },
    });

    await this.passwordResetRepository.remove(expiredPasswordResets);

    const oldPasswordReset = await this.passwordResetRepository
      .createQueryBuilder('password_resets')
      .where(
        new Brackets((q) => {
          q.where('user_id = :userId', { userId: user.id })
            .andWhere('email = :userEmail', { userEmail: user.email })
            .andWhere('DATE_ADD( updated_at, INTERVAL 2 MINUTE ) >= NOW()');
        }),
      )
      .getCount();

    if (oldPasswordReset > 0) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Please wait before retrying.`,
          error: 'Bad Request',
        }),
      );
    }

    const notExpiredPasswordReset = await this.passwordResetRepository.findOne({
      where: {
        user_id: user.id,
        email: user.email,
        expired_at: Raw((alias) => `${alias} > NOW()`),
      },
    });

    let token = null;
    if (notExpiredPasswordReset) {
      token = notExpiredPasswordReset.token;

      await this.passwordResetRepository.save({
        ...notExpiredPasswordReset,
        expired_at: moment().utc().add(30, 'minutes').toISOString(),
      });
    } else {
      do {
        token = Math.floor(1000 + Math.random() * 9000).toString();
      } while (
        await this.passwordResetRepository.findOne({
          where: {
            token,
            user_id: user.id,
            email: user.email,
          },
        })
      );

      await this.passwordResetRepository.save({
        user_id: user.id,
        email: user.email,
        expired_at: moment().utc().add(30, 'minutes').toISOString(),
        token,
      });
    }

    await this.clientKafka
      .send('createSendEmail', {
        organization_id: user.organization_id,
        from: 'no-reply@vodea.cloud',
        from_name: 'VodeaMail',
        to: user.email,
        to_name: user.name,
        subject: 'Reset Password Request',
        html: `
          <html lang="en">
            <body>
              <h1>Reset Password Request</h1>
              <span>This is your token reset password</span>
              <p><strong>${token}</strong></p>
              <span>Code will expired at 30 minutes from email received</span>
            </body>
          </html>
        `,
      })
      .toPromise();

    return 'Successfully send reset password token.';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, token, password } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The credentials does not match in our records.`,
          error: 'Bad Request',
        }),
      );
    }

    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        user_id: user.id,
        email: user.email,
        token,
        expired_at: Raw((alias) => `${alias} > NOW()`),
      },
    });

    if (!passwordReset) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The token is invalid.`,
          error: 'Bad Request',
        }),
      );
    }

    await this.userRepository.save({
      ...user,
      password: await hash(password, await genSalt(10)),
    });

    await this.passwordResetRepository.remove(passwordReset);

    return 'Successfully reset password.';
  }
}
