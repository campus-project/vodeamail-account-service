import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { compareSync, genSalt, hash } from 'bcryptjs';
import { User } from '../entities/user.entity';

import { GetAccountDto } from '../../application/dtos/account/get-account.dto';
import { UpdateAccountDto } from '../../application/dtos/account/update-account.dto';
import { ChangePasswordAccountDto } from '../../application/dtos/account/change-password-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAccount(getAccountDto: GetAccountDto): Promise<User> {
    const { id } = getAccountDto;
    const data = await this.userRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `The credentials does not match in our records.`,
          error: 'Unauthorized',
        }),
      );
    }

    return data;
  }

  async updateAccount(updateAccountDto: UpdateAccountDto): Promise<User> {
    const { id, name, email } = updateAccountDto;
    const data = await this.userRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `The credentials does not match in our records.`,
          error: 'Unauthorized',
        }),
      );
    }

    await this.userRepository.save({
      ...data,
      name,
      email,
    });

    return await this.getAccount({ id });
  }

  async changePasswordAccount(
    changePasswordAccountDto: ChangePasswordAccountDto,
  ): Promise<User> {
    const { id, old_password, password } = changePasswordAccountDto;

    const data = await this.userRepository.findOne({ id });

    if (!data || !compareSync(old_password, data.password)) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The old password is incorrect.`,
          error: 'Bad Request',
        }),
      );
    }

    if (old_password === password) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The new password is cannot be same with current password.`,
          error: 'Bad Request',
        }),
      );
    }

    await this.userRepository.save({
      ...data,
      password: await hash(password, await genSalt(10)),
    });

    return await this.getAccount({ id });
  }
}
