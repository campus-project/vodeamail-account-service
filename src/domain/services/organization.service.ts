import { Injectable } from '@nestjs/common';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as _ from 'lodash';

import { Organization } from '../entities/organization.entity';
import { FindOrganizationDto } from '../../application/dtos/organization/find-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async findAll(
    findAllOrganizationDto: FindOrganizationDto,
  ): Promise<Organization[]> {
    return await this.findQueryBuilder(findAllOrganizationDto).getMany();
  }

  async findAllCount(
    findAllCountOrganizationDto: FindOrganizationDto,
  ): Promise<number> {
    return await this.findQueryBuilder(findAllCountOrganizationDto).getCount();
  }

  async findOne(
    findOneOrganizationDto: FindOrganizationDto,
  ): Promise<Organization> {
    const data = await this.findAll(findOneOrganizationDto);
    return _.head(data);
  }

  findQueryBuilder(
    params: FindOrganizationDto,
  ): SelectQueryBuilder<Organization> {
    const {
      id,
      ids,
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

    let qb = this.organizationRepository
      .createQueryBuilder('organization')
      .where((qb) => {
        qb.where({
          ...(id || ids ? { id: In(filteredIds) } : {}),
        });

        if (search !== undefined) {
          const params = { search: `%${search}%` };

          qb.andWhere(
            new Brackets((q) => {
              q.where('organization.name LIKE :search', params);
            }),
          );
        }
      });

    if (relations !== undefined) {
      if (relations.includes('roles')) {
        qb = qb.leftJoinAndSelect('organization.roles', 'roles');
      }

      if (relations.includes('users')) {
        qb = qb.leftJoinAndSelect('organization.users', 'users');
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
