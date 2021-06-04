import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RoleService } from '../../domain/services/role.service';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { FindRoleDto } from '../dtos/role/find-role.dto';
import { DeleteRoleDto } from '../dtos/role/delete-role.dto';
import { RoleIdExistsDto } from '../dtos/role/role-id-exists.dto';

@Controller()
export class RoleController {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleService: RoleService,
  ) {}

  @MessagePattern('createRole')
  create(
    @Payload('value')
    createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(createRoleDto);
  }

  @MessagePattern('findAllRole')
  findAll(@Payload('value') findRole: FindRoleDto) {
    return this.roleService.findAll(findRole);
  }

  @MessagePattern('findAllCountRole')
  findAllCount(@Payload('value') findRole: FindRoleDto) {
    return this.roleService.findAllCount(findRole);
  }

  @MessagePattern('findOneRole')
  findOne(@Payload('value') findRole: FindRoleDto) {
    return this.roleService.findOne(findRole);
  }

  @MessagePattern('updateRole')
  update(@Payload('value') updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @MessagePattern('removeRole')
  remove(@Payload('value') deleteRole: DeleteRoleDto) {
    return this.roleService.remove(deleteRole);
  }

  @MessagePattern('existsRole')
  exists(@Payload('value') existsRole: RoleIdExistsDto) {
    return this.roleService.idExists(existsRole);
  }
}
