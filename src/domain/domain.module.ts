import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthService } from './services/auth.service';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { OrganizationService } from './services/organization.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';

const providers: Provider[] = [
  {
    provide: 'ORGANIZATION_SERVICE',
    useClass: OrganizationService,
  },
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
