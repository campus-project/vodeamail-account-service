import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from '../../domain/services/user.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { FindUserDto } from '../dtos/user/find-user.dto';
import { DeleteUserDto } from '../dtos/user/delete-user.dto';

@Controller()
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  @MessagePattern('createUser')
  create(
    @Payload('value')
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('findAllUser')
  findAll(@Payload('value') findUser: FindUserDto) {
    return this.userService.findAll(findUser);
  }

  @MessagePattern('findAllCountUser')
  findAllCount(@Payload('value') findUser: FindUserDto) {
    return this.userService.findAllCount(findUser);
  }

  @MessagePattern('findOneUser')
  findOne(@Payload('value') findUser: FindUserDto) {
    return this.userService.findOne(findUser);
  }

  @MessagePattern('updateUser')
  update(@Payload('value') updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload('value') deleteUser: DeleteUserDto) {
    return this.userService.remove(deleteUser);
  }
}
