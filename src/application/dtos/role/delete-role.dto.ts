import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class DeleteRoleDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsOptional()
  @IsBoolean()
  is_hard?: boolean;

  @IsOptional()
  @IsUUID('4')
  actor?: string;
}
