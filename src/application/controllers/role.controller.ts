import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RoleService } from '../../domain/services/role.service';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { FindRoleDto } from '../dtos/role/find-role.dto';
import { DeleteRoleDto } from '../dtos/role/delete-role.dto';
import { RoleIdExistsDto } from '../dtos/role/role-id-exists.dto';

import { Role } from '../../domain/entities/role.entity';

@Controller()
export class RoleController {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleService: RoleService,
  ) {}

  @MessagePattern('createRole')
  async create(
    @Payload()
    createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }

  @MessagePattern('findAllRole')
  async findAll(@Payload() findRole: FindRoleDto): Promise<Role[]> {
    return await this.roleService.findAll(findRole);
  }

  @MessagePattern('findAllCountRole')
  async findAllCount(@Payload() findRole: FindRoleDto): Promise<number> {
    return await this.roleService.findAllCount(findRole);
  }

  @MessagePattern('findOneRole')
  async findOne(@Payload() findRole: FindRoleDto): Promise<Role> {
    return await this.roleService.findOne(findRole);
  }

  @MessagePattern('updateRole')
  async update(@Payload() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return await this.roleService.update(updateRoleDto);
  }

  @MessagePattern('removeRole')
  async remove(@Payload() deleteRole: DeleteRoleDto): Promise<Role> {
    return await this.roleService.remove(deleteRole);
  }

  @MessagePattern('existsRole')
  async exists(@Payload() existsRole: RoleIdExistsDto): Promise<boolean> {
    return await this.roleService.idExists(existsRole);
  }
}
