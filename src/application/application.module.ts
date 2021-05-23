import { Module } from '@nestjs/common';

import { RoleExists } from './rules/role-exists.rule';
import { UserEmailUniqueRule } from './rules/user-email-unique.rule';

import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { OrganizationController } from './controllers/organization.controller';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [InfrastructureModule, DomainModule],
  controllers: [
    OrganizationController,
    RoleController,
    UserController,
    AuthController,
    AccountController,
  ],
  providers: [RoleExists, UserEmailUniqueRule],
  exports: [InfrastructureModule, DomainModule],
})
export class ApplicationModule {}
