import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAccountDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
