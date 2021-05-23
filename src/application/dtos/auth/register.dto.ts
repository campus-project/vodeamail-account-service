import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserEmailUniqueRule } from '../../rules/user-email-unique.rule';
import { Match } from '../../../@core/rules/match.rule';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserEmailUniqueRule)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @Match('password', { message: 'The $property does not match with password' })
  password_confirmation: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  organization_name: string;
}
