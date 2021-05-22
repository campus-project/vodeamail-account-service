import { IsNotEmpty, IsUUID } from 'class-validator';

export class LoginWithIdDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}
