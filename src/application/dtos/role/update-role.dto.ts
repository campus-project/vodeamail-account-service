import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
