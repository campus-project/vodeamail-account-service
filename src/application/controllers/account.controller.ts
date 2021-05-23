import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccountService } from '../../domain/services/account.service';
import { GetAccountDto } from '../dtos/account/get-account.dto';
import { UpdateAccountDto } from '../dtos/account/update-account.dto';
import { ChangePasswordAccountDto } from '../dtos/account/change-password-account.dto';
import { GetMyOrganizationDto } from '../dtos/account/get-my-organization.dto';
import { UpdateMyOrganizationDto } from '../dtos/account/update-my-organization.dto';

@Controller()
export class AccountController {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly accountService: AccountService,
  ) {}

  @MessagePattern('getAccount')
  getAccount(@Payload('value') getAccountDto: GetAccountDto) {
    return this.accountService.getAccount(getAccountDto);
  }

  @MessagePattern('updateAccount')
  updateAccount(@Payload('value') updateAccountDto: UpdateAccountDto) {
    return this.accountService.updateAccount(updateAccountDto);
  }

  @MessagePattern('changePasswordAccount')
  changePasswordAccount(
    @Payload('value') changePasswordAccountDto: ChangePasswordAccountDto,
  ) {
    return this.accountService.changePasswordAccount(changePasswordAccountDto);
  }

  @MessagePattern('getMyOrganization')
  getMyOrganization(
    @Payload('value') getMyOrganizationDto: GetMyOrganizationDto,
  ) {
    return this.accountService.getMyOrganization(getMyOrganizationDto);
  }

  @MessagePattern('updateMyOrganization')
  updateMyOrganization(
    @Payload('value') updateMyOrganizationDto: UpdateMyOrganizationDto,
  ) {
    return this.accountService.updateMyOrganization(updateMyOrganizationDto);
  }
}
