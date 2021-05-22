import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';

import { UserEmailUniqueRule } from '../../rules/user-email-unique.rule';
import { RoleExists } from '../../rules/role-exists.rule';

export class CreateUserDto {
  @IsNotEmpty()
  @IsUUID('4')
  organization_id: string;

  @IsNotEmpty()
  @IsUUID('4')
  @Validate(RoleExists)
  role_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserEmailUniqueRule)
  email: string;

  @IsOptional()
  @IsUUID('4')
  actor?: string;
}
