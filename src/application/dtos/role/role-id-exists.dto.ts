import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RoleIdExistsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsUUID('4')
  organization_id: string;

  @IsOptional()
  @IsBoolean()
  is_special?: boolean;
}
