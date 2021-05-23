import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { UserEmailUniqueRule } from '../../rules/user-email-unique.rule';

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserEmailUniqueRule)
  email: string;
}
