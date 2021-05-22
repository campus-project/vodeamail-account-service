import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { RoleService } from '../../domain/services/role.service';

@ValidatorConstraint({ name: 'RoleExists', async: true })
@Injectable()
export class RoleExists implements ValidatorConstraintInterface {
  constructor(
    @Inject('ROLE_SERVICE')
    private roleService: RoleService,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    return await this.roleService.idExists({
      id: value,
      organization_id: (args.object as any)['organization_id'],
    });
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is invalid.`;
  }
}
