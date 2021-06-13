import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url: string;
}
