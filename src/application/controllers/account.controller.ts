import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccountService } from '../../domain/services/account.service';
import { GetAccountDto } from '../dtos/account/get-account.dto';
import { UpdateAccountDto } from '../dtos/account/update-account.dto';
import { ChangePasswordAccountDto } from '../dtos/account/change-password-account.dto';
import { GetMyOrganizationDto } from '../dtos/account/get-my-organization.dto';
import { UpdateMyOrganizationDto } from '../dtos/account/update-my-organization.dto';

import { User } from '../../domain/entities/user.entity';
import { Organization } from '../../domain/entities/organization.entity';

@Controller()
export class AccountController {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly accountService: AccountService,
  ) {}

  @MessagePattern('getAccount')
  async getAccount(@Payload() getAccountDto: GetAccountDto): Promise<User> {
    return await this.accountService.getAccount(getAccountDto);
  }

  @MessagePattern('updateAccount')
  async updateAccount(
    @Payload() updateAccountDto: UpdateAccountDto,
  ): Promise<User> {
    return await this.accountService.updateAccount(updateAccountDto);
  }

  @MessagePattern('changePasswordAccount')
  async changePasswordAccount(
    @Payload() changePasswordAccountDto: ChangePasswordAccountDto,
  ): Promise<User> {
    return await this.accountService.changePasswordAccount(
      changePasswordAccountDto,
    );
  }

  @MessagePattern('getMyOrganization')
  async getMyOrganization(
    @Payload() getMyOrganizationDto: GetMyOrganizationDto,
  ): Promise<Organization> {
    return await this.accountService.getMyOrganization(getMyOrganizationDto);
  }

  @MessagePattern('updateMyOrganization')
  async updateMyOrganization(
    @Payload() updateMyOrganizationDto: UpdateMyOrganizationDto,
  ): Promise<Organization> {
    return await this.accountService.updateMyOrganization(
      updateMyOrganizationDto,
    );
  }
}
