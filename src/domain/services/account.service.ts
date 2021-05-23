import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { compareSync, genSalt, hash } from 'bcryptjs';
import { User } from '../entities/user.entity';

import { GetAccountDto } from '../../application/dtos/account/get-account.dto';
import { UpdateAccountDto } from '../../application/dtos/account/update-account.dto';
import { ChangePasswordAccountDto } from '../../application/dtos/account/change-password-account.dto';
import { Organization } from '../entities/organization.entity';
import { UpdateOrganizationDto } from '../../application/dtos/organization/update-organization.dto';
import { GetMyOrganizationDto } from '../../application/dtos/account/get-my-organization.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async getAccount(getAccountDto: GetAccountDto): Promise<User> {
    const { id } = getAccountDto;
    const data = await this.userRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Count not find resource',
          error: 'Not Found',
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
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Count not find resource',
          error: 'Not Found',
        }),
      );
    }

    await this.userRepository.save({
      ...data,
      name,
      email,
      actor: data.id,
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
      actor: data.id,
    });

    return await this.getAccount({ id });
  }

  async getMyOrganization(
    getMyOrganizationDto: GetMyOrganizationDto,
  ): Promise<Organization> {
    const { id } = getMyOrganizationDto;
    const data = await this.organizationRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Count not find resource',
          error: 'Not Found',
        }),
      );
    }

    return data;
  }

  async updateMyOrganization(
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const { id, name, address, telephone, fax, actor } = updateOrganizationDto;

    const data = await this.organizationRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}.`,
          error: 'Not Found',
        }),
      );
    }

    await this.organizationRepository.save({
      ...data,
      name,
      address,
      telephone,
      fax,
      updated_by: actor,
    });

    return await this.getMyOrganization({ id });
  }
}
