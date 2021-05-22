import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';

@ValidatorConstraint({ name: 'UserEmailUniqueRule', async: true })
@Injectable()
export class UserEmailUniqueRule implements ValidatorConstraintInterface {
  constructor(
    @Inject('USER_SERVICE')
    private userService: UserService,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    return !(await this.userService.emailExists({
      email: value,
      exclude: (args.object as any)['id'],
    }));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} has already been taken.`;
  }
}
