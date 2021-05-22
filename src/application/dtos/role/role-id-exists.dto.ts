import { IsNotEmpty, IsUUID } from 'class-validator';

export class RoleIdExistsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsUUID('4')
  organization_id: string;
}
