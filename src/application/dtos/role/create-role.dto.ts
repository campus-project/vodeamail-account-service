import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsUUID('4')
  organization_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID('4')
  actor?: string;
}
