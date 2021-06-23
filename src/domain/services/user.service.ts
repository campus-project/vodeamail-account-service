import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Brackets, In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';

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
    @Inject('MAILER_SERVICE')
    private readonly mailerService: ClientProxy,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { organization_id, name, email, role_id, actor } = createUserDto;

    const randomPwd = randomString(8);
    const password = await hash(randomPwd, await genSalt(10));

    const data = await this.userRepository.save({
      organization_id,
      name,
      email,
      password,
      role_id,
      created_by: actor,
      updated_by: actor,
    });

    await this.mailerService
      .send('createSendEmail', {
        organization_id: data.organization_id,
        from: 'no-reply@vodea.cloud',
        from_name: 'VodeaMail',
        to: data.email,
        to_name: data.name,
        subject: 'Welcome to Vodea Cloud',
        html: `
          <html lang="en">
            <body>
              <h1>Password Access</h1>
              <span>This is your password</span>
              <p><strong>${randomPwd}</strong></p>
              <span>Please change password after first login</span>
            </body>
          </html>
        `,
      })
      .toPromise();

    return await this.findOne({
      id: data.id,
      organization_id: data.organization_id,
    });
  }

  async findAll(findAllUserDto: FindUserDto): Promise<User[]> {
    return await this.findQueryBuilder(findAllUserDto).getMany();
  }

  async findAllCount(findAllCountUserDto: FindUserDto): Promise<number> {
    return await this.findQueryBuilder(findAllCountUserDto).getCount();
  }

  async findOne(findOneUserDto: FindUserDto): Promise<User> {
    const data = await this.findAll(findOneUserDto);
    return _.head(data);
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, organization_id, name, email, role_id, actor } = updateUserDto;

    const data = await this.userRepository.findOne({
      where: {
        id,
        organization_id,
      },
    });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}.`,
          error: 'Not Found',
        }),
      );
    }

    await this.userRepository.save({
      ...data,
      name,
      email,
      role_id,
      updated_by: actor,
    });

    return await this.findOne({
      id: data.id,
      organization_id: data.organization_id,
    });
  }

  async remove(deleteUserDto: DeleteUserDto): Promise<User> {
    const { id, is_hard, organization_id, actor } = deleteUserDto;

    const data = await this.userRepository.findOne({
      where: {
        id,
        organization_id,
      },
    });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}.`,
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

  findQueryBuilder(params: FindUserDto): SelectQueryBuilder<User> {
    const {
      id,
      ids,
      organization_id,
      search,
      per_page,
      page = 1,
      order_by,
      sorted_by = 'ASC',
      relations,
    } = params;

    const filteredIds = ids === undefined ? [] : ids;
    if (id !== undefined) {
      filteredIds.push(id);
    }

    let qb = this.userRepository.createQueryBuilder('user').where((qb) => {
      qb.where({
        organization_id: organization_id,
        ...(id || ids ? { id: In(filteredIds) } : {}),
      });

      if (search !== undefined) {
        const params = { search: `%${search}%` };

        qb.andWhere(
          new Brackets((q) => {
            q.where('user.name LIKE :search', params).orWhere(
              'user.email LIKE :search',
              params,
            );
          }),
        );
      }
    });

    if (relations !== undefined) {
      if (relations.includes('role')) {
        qb = qb.leftJoinAndSelect('user.role', 'role');
      }
    }

    if (per_page !== undefined) {
      qb = qb.take(per_page).skip(page > 1 ? per_page * (page - 1) : 0);
    }

    if (order_by !== undefined) {
      qb = qb.orderBy(
        order_by,
        ['desc'].includes(sorted_by.toLowerCase()) ? 'DESC' : 'ASC',
      );
    }

    return qb;
  }
}
