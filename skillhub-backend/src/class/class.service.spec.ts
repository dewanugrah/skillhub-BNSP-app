import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from './class.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassService, PrismaService],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
