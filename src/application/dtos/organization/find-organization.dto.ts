import { IsOptional, IsUUID } from 'class-validator';

export class FindOrganizationDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  ids?: string[];
}
