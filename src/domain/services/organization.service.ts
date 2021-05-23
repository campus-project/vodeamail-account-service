import { HttpStatus, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import * as _ from 'lodash';

import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from '../../application/dtos/organization/create-organization.dto';
import { UpdateOrganizationDto } from '../../application/dtos/organization/update-organization.dto';
import { FindOrganizationDto } from '../../application/dtos/organization/find-organization.dto';
import { DeleteOrganizationDto } from '../../application/dtos/organization/delete-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const { name, address, telephone, fax, actor } = createOrganizationDto;

    const data = await this.organizationRepository.save({
      name,
      address,
      telephone,
      fax,
      created_by: actor,
      updated_by: actor,
    });

    return await this.findOne({ id: data.id });
  }

  async findAll(
    findAllOrganizationDto: FindOrganizationDto,
  ): Promise<Organization[]> {
    const { id, ids } = findAllOrganizationDto;
    const qb = this.organizationRepository
      .createQueryBuilder('organizations')
      .select('organizations.*')
      .where(
        new Brackets((q) => {
          if (id !== undefined) {
            q.where('organizations.id = :id', { id });
          }

          if (Array.isArray(ids) && ids.length) {
            q.andWhere('organizations.id IN (:...ids)', { ids });
          }
        }),
      );

    return await qb.execute();
  }

  async findOne(
    findOneOrganizationDto: FindOrganizationDto,
  ): Promise<Organization> {
    const data = await this.findAll(findOneOrganizationDto);
    return _.head(data);
  }

  async update(
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const { id, name, address, telephone, fax, actor } = updateOrganizationDto;

    const data = await this.organizationRepository.findOne({ id });

    if (!data) {
      throw new RpcException(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Count not find resource ${id}`,
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

    return await this.findOne({ id: data.id });
  }

  async remove(
    deleteOrganizationDto: DeleteOrganizationDto,
  ): Promise<Organization> {
    const { id, is_hard, actor } = deleteOrganizationDto;

    const data = await this.organizationRepository.findOne({ id });

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
      await this.organizationRepository.remove(data);
    } else {
      await this.organizationRepository.save({
        ...data,
        deleted_by: actor,
        deleted_at: new Date().toISOString(),
      });
    }

    return data;
  }
}
