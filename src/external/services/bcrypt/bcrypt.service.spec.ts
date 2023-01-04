import { Test, TestingModule } from '@nestjs/testing';
import { BcryptServiceImpl } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptServiceImpl],
    }).compile();

    service = module.get<BcryptServiceImpl>(BcryptServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password correctly', async () => {
    const passwordHashed = await service.hash('password');

    expect(await service.compare('password', passwordHashed)).toBe(true);
  });
});
