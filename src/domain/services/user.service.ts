import { HttpStatus, Injectable } from '@nestjs/common';
import { Brackets, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import * as _ from 'lodash';
import { genSalt, hash } from 'bcryptjs';
import { randomString } from '../../@core/helpers/random-string.helper';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../application/dtos/user/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/user/update-user.dto';
import { FindUserDto } from '../../application/dtos/user/find-user.dto';
import { DeleteUserDto } from '../../application/dtos/user/delete-user.dto';
import { UserEmailExistsDto } from '../../application/dtos/user/user-email-exists.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { organization_id, name, email, role_id, actor } = createUserDto;

    const randomPwd = randomString(8);
    const password = await hash(randomPwd, await genSalt(10));

    console.log(randomPwd);

    const data = await this.userRepository.save({
      organization_id,
      name,
      email,
      password,
      role_id,
      created_by: actor,
      updated_by: actor,
    });

    return await this.findOne({ id: data.id });
  }

  async findAll(findAllUserDto: FindUserDto): Promise<User[]> {
    const { id, ids } = findAllUserDto;
    const qb = this.userRepository
      .createQueryBuilder('users')
      .select('users.id', 'id')
      .addSelect('users.name', 'name')
      .addSelect('users.email', 'email')
      .addSelect('users.organization_id', 'organization_id')
      .addSelect('users.role_id', 'role_id')
      .addSelect('users.created_at', 'created_at')
      .addSelect('users.created_by', 'created_by')
      .addSelect('users.updated_at', 'updated_at')
      .addSelect('users.updated_by', 'updated_by')
      .addSelect('users.deleted_at', 'deleted_at')
      .addSelect('users.deleted_by', 'deleted_by')
      .where(
        new Brackets((q) => {
          if (id !== undefined) {
            q.where('users.id = :id', { id });
          }

          if (Array.isArray(ids) && ids.length) {
            q.andWhere('users.id IN (:...ids)', { ids });
          }
        }),
      );

    return await qb.execute();
  }

  async findOne(findOneUserDto: FindUserDto): Promise<User> {
    const data = await this.findAll(findOneUserDto);
    return _.head(data);
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, organization_id, name, email, role_id, actor } = updateUserDto;

    const data = await this.userRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}`,
          error: 'Not Found',
        }),
      );
    }

    Object.assign(data, {
      organization_id,
      name,
      email,
      role_id,
      updated_by: actor,
    });

    await this.userRepository.save(data);

    return await this.findOne({ id: data.id });
  }

  async remove(deleteUserDto: DeleteUserDto): Promise<User> {
    const { id, is_hard, actor } = deleteUserDto;

    const data = await this.userRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}`,
          error: 'Not Found',
        }),
      );
    }

    if (is_hard) {
      await this.userRepository.remove(data);
    } else {
      await this.userRepository.save({
        ...data,
        deleted_by: actor,
        deleted_at: new Date().toISOString(),
      });
    }

    return data;
  }

  async emailExists(userEmailExistsDto: UserEmailExistsDto): Promise<boolean> {
    const { email, exclude } = userEmailExistsDto;
    return !!(await this.userRepository.findOne({
      where: {
        email,
        ...(exclude === undefined ? {} : { id: Not(exclude) }),
      },
    }));
  }
}
