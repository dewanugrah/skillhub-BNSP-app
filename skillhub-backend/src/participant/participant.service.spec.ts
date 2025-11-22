import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantService } from './participant.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ParticipantService', () => {
  let service: ParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantService, PrismaService],
    }).compile();

    service = module.get<ParticipantService>(ParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
