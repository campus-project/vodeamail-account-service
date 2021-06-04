import { HttpStatus, Injectable } from '@nestjs/common';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import * as _ from 'lodash';

import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { CreateRoleDto } from '../../application/dtos/role/create-role.dto';
import { UpdateRoleDto } from '../../application/dtos/role/update-role.dto';
import { FindRoleDto } from '../../application/dtos/role/find-role.dto';
import { DeleteRoleDto } from '../../application/dtos/role/delete-role.dto';
import { RoleIdExistsDto } from '../../application/dtos/role/role-id-exists.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { organization_id, name, actor } = createRoleDto;

    const data = await this.roleRepository.save({
      organization_id,
      name,
      created_by: actor,
      updated_by: actor,
    });

    return await this.findOne({
      id: data.id,
      organization_id: data.organization_id,
    });
  }

  async findAll(findAllRoleDto: FindRoleDto): Promise<Role[]> {
    return await this.findQueryBuilder(findAllRoleDto).getMany();
  }

  async findAllCount(findAllCountRoleDto: FindRoleDto): Promise<number> {
    return await this.findQueryBuilder(findAllCountRoleDto).getCount();
  }

  async findOne(findOneRoleDto: FindRoleDto): Promise<Role> {
    const data = await this.findAll(findOneRoleDto);
    return _.head(data);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { id, organization_id, name, actor } = updateRoleDto;

    const data = await this.roleRepository.findOne({
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

    await this.roleRepository.save({
      ...data,
      name,
      updated_by: actor,
    });

    return await this.findOne({
      id: data.id,
      organization_id: data.organization_id,
    });
  }

  async remove(deleteRoleDto: DeleteRoleDto): Promise<Role> {
    const { id, is_hard, organization_id, actor } = deleteRoleDto;

    const data = await this.roleRepository.findOne({
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
      await this.roleRepository.remove(data);
    } else {
      await this.roleRepository.save({
        ...data,
        deleted_by: actor,
        deleted_at: new Date().toISOString(),
      });
    }

    return data;
  }

  async idExists(roleIdExistsDto: RoleIdExistsDto): Promise<boolean> {
    const { id, organization_id, is_special } = roleIdExistsDto;
    return (
      (await this.roleRepository.count({
        where: {
          id,
          organization_id,
          ...(is_special === undefined ? {} : { is_special }),
        },
      })) > 0
    );
  }

  findQueryBuilder(params: FindRoleDto): SelectQueryBuilder<Role> {
    const {
      id,
      ids,
      organization_id,
      special,
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

    console.log(params);

    let qb = this.roleRepository
      .createQueryBuilder('role')
      .innerJoinAndSelect('role.summary', 'summary')
      .where((qb) => {
        qb.where({
          organization_id: organization_id,
          ...(id || ids ? { id: In(filteredIds) } : {}),
          ...(special === undefined ? {} : { is_special: !!special }),
        });

        if (search !== undefined) {
          const params = { search: `%${search}%` };

          qb.andWhere(
            new Brackets((q) => {
              q.where('role.name LIKE :search', params);
            }),
          );
        }
      });

    if (relations !== undefined) {
      if (relations.includes('users')) {
        qb = qb.leftJoinAndSelect('role.users', 'users');
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
