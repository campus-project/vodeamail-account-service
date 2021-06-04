import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AccountService } from './services/account.service';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';

const providers: Provider[] = [
  {
    provide: 'ROLE_SERVICE',
    useClass: RoleService,
  },
  {
    provide: 'USER_SERVICE',
    useClass: UserService,
  },
  {
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  },
  {
    provide: 'ACCOUNT_SERVICE',
    useClass: AccountService,
  },
];

@Module({
  imports: [
    InfrastructureModule,
    TypeOrmModule.forFeature([Organization, Role, User, PasswordReset]),
  ],
  providers: [...providers],
  exports: [...providers],
})
export class DomainModule {}
