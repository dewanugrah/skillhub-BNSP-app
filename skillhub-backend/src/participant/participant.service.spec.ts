import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantService } from './participant.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Unit tests untuk ParticipantService
 * Menggunakan mock PrismaService untuk menghindari database dependencies
 */
describe('ParticipantService', () => {
  let service: ParticipantService;
  let prismaService: PrismaService;

  // Mock data untuk testing
  const mockParticipant = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '08123456789',
    address: 'Jl. Example No. 123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockParticipantWithEnrollments = {
    ...mockParticipant,
    enrollments: [
      {
        id: 1,
        participantId: 1,
        classId: 1,
        enrollmentDate: new Date(),
        class: {
          id: 1,
          className: 'Desain Grafis',
          description: 'Belajar desain grafis',
          instructor: 'Jane Smith',
          createdAt: new Date(),
        },
      },
    ],
  };

  // Mock PrismaService
  const mockPrismaService = {
    participant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ParticipantService>(ParticipantService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of participants with enrollments', async () => {
      const mockParticipants = [mockParticipantWithEnrollments];
      mockPrismaService.participant.findMany.mockResolvedValue(mockParticipants);

      const result = await service.findAll();

      expect(result).toEqual(mockParticipants);
      expect(prismaService.participant.findMany).toHaveBeenCalledWith({
        include: { enrollments: true },
      });
      expect(prismaService.participant.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no participants exist', async () => {
      mockPrismaService.participant.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.participant.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a participant with enrollments and class details', async () => {
      mockPrismaService.participant.findUnique.mockResolvedValue(
        mockParticipantWithEnrollments,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(mockParticipantWithEnrollments);
      expect(prismaService.participant.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          enrollments: {
            include: { class: true },
          },
        },
      });
    });

    it('should return null when participant not found', async () => {
      mockPrismaService.participant.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(prismaService.participant.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          enrollments: {
            include: { class: true },
          },
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new participant', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '08123456789',
        address: 'Jl. Example No. 123',
      };

      mockPrismaService.participant.create.mockResolvedValue(mockParticipant);

      const result = await service.create(createDto);

      expect(result).toEqual(mockParticipant);
      expect(prismaService.participant.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(prismaService.participant.create).toHaveBeenCalledTimes(1);
    });

    it('should create participant without optional fields', async () => {
      const createDto = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      const mockResult = {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.participant.create.mockResolvedValue(mockResult);

      const result = await service.create(createDto);

      expect(result).toEqual(mockResult);
      expect(result.phoneNumber).toBeNull();
      expect(result.address).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing participant', async () => {
      const updateDto = {
        name: 'John Updated',
        phoneNumber: '08199999999',
      };

      const updatedParticipant = {
        ...mockParticipant,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockPrismaService.participant.update.mockResolvedValue(updatedParticipant);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedParticipant);
      expect(result.name).toBe('John Updated');
      expect(result.phoneNumber).toBe('08199999999');
      expect(prismaService.participant.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should update only email field', async () => {
      const updateDto = {
        email: 'newemail@example.com',
      };

      const updatedParticipant = {
        ...mockParticipant,
        email: 'newemail@example.com',
      };

      mockPrismaService.participant.update.mockResolvedValue(updatedParticipant);

      const result = await service.update(1, updateDto);

      expect(result.email).toBe('newemail@example.com');
      expect(prismaService.participant.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a participant', async () => {
      mockPrismaService.participant.delete.mockResolvedValue(mockParticipant);

      const result = await service.delete(1);

      expect(result).toEqual(mockParticipant);
      expect(prismaService.participant.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.participant.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion of participant with enrollments (cascade)', async () => {
      // Dalam real scenario, Prisma akan cascade delete enrollments
      mockPrismaService.participant.delete.mockResolvedValue(
        mockParticipantWithEnrollments,
      );

      const result = await service.delete(1);

      expect(result).toBeDefined();
      expect(prismaService.participant.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors on findAll', async () => {
      mockPrismaService.participant.findMany.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle database errors on create', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockPrismaService.participant.create.mockRejectedValue(
        new Error('Unique constraint violation'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        'Unique constraint violation',
      );
    });

    it('should handle not found error on update', async () => {
      mockPrismaService.participant.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        'Record not found',
      );
    });

    it('should handle not found error on delete', async () => {
      mockPrismaService.participant.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.delete(999)).rejects.toThrow('Record not found');
    });
  });
});
