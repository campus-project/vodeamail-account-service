import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InfrastructureModule, TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
