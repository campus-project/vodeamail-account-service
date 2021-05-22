import { CreateOrganizationDto } from './create-organization.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
