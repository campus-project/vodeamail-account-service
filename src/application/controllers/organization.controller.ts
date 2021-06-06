import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { OrganizationService } from '../../domain/services/organization.service';
import { FindOrganizationDto } from '../dtos/organization/find-organization.dto';

@Controller()
export class OrganizationController {
  constructor(
    @Inject('ORGANIZATION_SERVICE')
    private readonly organizationService: OrganizationService,
  ) {}

  @MessagePattern('findAllOrganization')
  findAll(@Payload('value') findOrganization: FindOrganizationDto) {
    return this.organizationService.findAll(findOrganization);
  }

  @MessagePattern('findAllCountOrganization')
  findAllCount(@Payload('value') findOrganization: FindOrganizationDto) {
    return this.organizationService.findAllCount(findOrganization);
  }

  @MessagePattern('findOneOrganization')
  findOne(@Payload('value') findOrganization: FindOrganizationDto) {
    return this.organizationService.findOne(findOrganization);
  }
}
