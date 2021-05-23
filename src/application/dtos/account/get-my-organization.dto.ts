import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetMyOrganizationDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
