import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RoleExists } from './rules/role-exists.rule';
import { UserEmailUniqueRule } from './rules/user-email-unique.rule';
import { OrganizationController } from './controllers/organization.controller';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [InfrastructureModule, DomainModule],
  controllers: [
    OrganizationController,
    RoleController,
    UserController,
    AuthController,
  ],
  providers: [RoleExists, UserEmailUniqueRule],
  exports: [InfrastructureModule, DomainModule],
})
export class ApplicationModule {}
