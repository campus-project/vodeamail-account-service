import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from '../../domain/services/user.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { FindUserDto } from '../dtos/user/find-user.dto';
import { DeleteUserDto } from '../dtos/user/delete-user.dto';
import { User } from '../../domain/entities/user.entity';

@Controller()
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  @MessagePattern('createUser')
  async create(
    @Payload()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @MessagePattern('findAllUser')
  async findAll(@Payload() findUser: FindUserDto): Promise<User[]> {
    return await this.userService.findAll(findUser);
  }

  @MessagePattern('findAllCountUser')
  async findAllCount(@Payload() findUser: FindUserDto): Promise<number> {
    return await this.userService.findAllCount(findUser);
  }

  @MessagePattern('findOneUser')
  async findOne(@Payload() findUser: FindUserDto): Promise<User> {
    return await this.userService.findOne(findUser);
  }

  @MessagePattern('updateUser')
  async update(@Payload() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(updateUserDto);
  }

  @MessagePattern('removeUser')
  async remove(@Payload() deleteUser: DeleteUserDto): Promise<User> {
    return await this.userService.remove(deleteUser);
  }
}
