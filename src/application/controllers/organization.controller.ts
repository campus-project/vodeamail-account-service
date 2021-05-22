import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { OrganizationService } from '../../domain/services/organization.service';
import { CreateOrganizationDto } from '../dtos/organization/create-organization.dto';
import { UpdateOrganizationDto } from '../dtos/organization/update-organization.dto';
import { FindOrganizationDto } from '../dtos/organization/find-organization.dto';
import { DeleteOrganizationDto } from '../dtos/organization/delete-organization.dto';

@Controller()
export class OrganizationController {
  constructor(
    @Inject('ORGANIZATION_SERVICE')
    private readonly organizationService: OrganizationService,
  ) {}

  @MessagePattern('createOrganization')
  create(
    @Payload('value')
    createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.create(createOrganizationDto);
  }

  @MessagePattern('findAllOrganization')
  findAll(@Payload('value') findOrganization: FindOrganizationDto) {
    return this.organizationService.findAll(findOrganization);
  }

  @MessagePattern('findOneOrganization')
  findOne(@Payload('value') findOrganization: FindOrganizationDto) {
    return this.organizationService.findOne(findOrganization);
  }

  @MessagePattern('updateOrganization')
  update(@Payload('value') updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(updateOrganizationDto);
  }

  @MessagePattern('removeOrganization')
  remove(@Payload('value') deleteOrganization: DeleteOrganizationDto) {
    return this.organizationService.remove(deleteOrganization);
  }
}
