import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
