import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';

describe('ParticipantController', () => {
  let controller: ParticipantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantController],
      providers: [
        {
          provide: ParticipantService,
          useValue: {
            // mock the service methods
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ParticipantController>(ParticipantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
