import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMyOrganizationDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsUUID('4')
  actor?: string;
}
