import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccountService } from '../../domain/services/account.service';
import { GetAccountDto } from '../dtos/account/get-account.dto';
import { UpdateAccountDto } from '../dtos/account/update-account.dto';
import { ChangePasswordAccountDto } from '../dtos/account/change-password-account.dto';

@Controller()
export class AccountController {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly accountService: AccountService,
  ) {}

  @MessagePattern('getAccount')
  login(@Payload('value') getAccountDto: GetAccountDto) {
    return this.accountService.getAccount(getAccountDto);
  }

  @MessagePattern('updateAccount')
  loginWithId(@Payload('value') updateAccountDto: UpdateAccountDto) {
    return this.accountService.updateAccount(updateAccountDto);
  }

  @MessagePattern('changePasswordAccount')
  register(
    @Payload('value') changePasswordAccountDto: ChangePasswordAccountDto,
  ) {
    return this.accountService.changePasswordAccount(changePasswordAccountDto);
  }
}
