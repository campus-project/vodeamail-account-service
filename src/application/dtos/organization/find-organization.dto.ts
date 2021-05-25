import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class FindOrganizationDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  ids?: string[];
}
