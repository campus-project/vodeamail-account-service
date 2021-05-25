import { HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import * as _ from 'lodash';

import { Role } from '../entities/role.entity';
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
    const { id, ids, organization_id } = findAllRoleDto;

    const filteredIds = ids === undefined ? [] : ids;
    if (id !== undefined) {
      filteredIds.push(id);
    }

    return await this.roleRepository.find({
      where: {
        organization_id: organization_id,
        ...(id || ids ? { id: In(filteredIds) } : {}),
      },
    });
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
    const { id, organization_id } = roleIdExistsDto;
    return !!(await this.roleRepository.findOne({
      where: { id, organization_id },
    }));
  }
}
