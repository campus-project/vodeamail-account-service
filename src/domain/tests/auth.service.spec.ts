import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { PasswordReset } from '../entities/password-reset.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InfrastructureModule,
        TypeOrmModule.forFeature([Organization, Role, User, PasswordReset]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
