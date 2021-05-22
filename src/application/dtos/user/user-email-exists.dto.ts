import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UserEmailExistsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUUID('4')
  exclude?: string;
}
