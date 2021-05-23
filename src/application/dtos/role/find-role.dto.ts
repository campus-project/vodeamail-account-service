import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class FindRoleDto {
  @IsNotEmpty()
  @IsUUID('4')
  organization_id: string;

  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  ids?: string[];
}
