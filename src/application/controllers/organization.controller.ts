import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { OrganizationService } from '../../domain/services/organization.service';
import { FindOrganizationDto } from '../dtos/organization/find-organization.dto';

import { Organization } from '../../domain/entities/organization.entity';

@Controller()
export class OrganizationController {
  constructor(
    @Inject('ORGANIZATION_SERVICE')
    private readonly organizationService: OrganizationService,
  ) {}

  @MessagePattern('findAllOrganization')
  async findAll(
    @Payload() findOrganization: FindOrganizationDto,
  ): Promise<Organization[]> {
    return await this.organizationService.findAll(findOrganization);
  }

  @MessagePattern('findAllCountOrganization')
  async findAllCount(
    @Payload() findOrganization: FindOrganizationDto,
  ): Promise<number> {
    return await this.organizationService.findAllCount(findOrganization);
  }

  @MessagePattern('findOneOrganization')
  async findOne(
    @Payload() findOrganization: FindOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationService.findOne(findOrganization);
  }
}
