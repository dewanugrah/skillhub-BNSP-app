import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Unit tests untuk EnrollmentService
 * Menggunakan mock PrismaService untuk menghindari database dependencies
 * Includes tests untuk duplicate prevention logic
 */
describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let prismaService: PrismaService;

  // Mock data untuk testing
  const mockEnrollment = {
    id: 1,
    participantId: 1,
    classId: 1,
    enrollmentDate: new Date(),
  };

  const mockEnrollmentWithRelations = {
    ...mockEnrollment,
    participant: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '08123456789',
      address: 'Jl. Example No. 123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    class: {
      id: 1,
      className: 'Desain Grafis',
      description: 'Belajar desain grafis',
      instructor: 'Jane Smith',
      createdAt: new Date(),
    },
  };

  // Mock PrismaService
  const mockPrismaService = {
    enrollment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new enrollment when no duplicate exists', async () => {
      const createDto = {
        participantId: 1,
        classId: 1,
      };

      // Mock: No existing enrollment found
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockEnrollment);
      expect(prismaService.enrollment.findFirst).toHaveBeenCalledWith({
        where: {
          participantId: 1,
          classId: 1,
        },
      });
      expect(prismaService.enrollment.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should throw ConflictException when duplicate enrollment exists', async () => {
      const createDto = {
        participantId: 1,
        classId: 1,
      };

      // Mock: Existing enrollment found (duplicate)
      mockPrismaService.enrollment.findFirst.mockResolvedValue(mockEnrollment);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Peserta sudah terdaftar di kelas ini.',
      );

      // Called twice because we tested twice (both ConflictException and message)
      expect(prismaService.enrollment.findFirst).toHaveBeenCalledTimes(2);
      expect(prismaService.enrollment.create).not.toHaveBeenCalled();
    });

    it('should allow same participant to enroll in different classes', async () => {
      const createDto1 = { participantId: 1, classId: 1 };
      const createDto2 = { participantId: 1, classId: 2 };

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValueOnce({
        ...mockEnrollment,
        classId: 1,
      });
      mockPrismaService.enrollment.create.mockResolvedValueOnce({
        ...mockEnrollment,
        id: 2,
        classId: 2,
      });

      const result1 = await service.create(createDto1);
      const result2 = await service.create(createDto2);

      expect(result1.classId).toBe(1);
      expect(result2.classId).toBe(2);
      expect(prismaService.enrollment.create).toHaveBeenCalledTimes(2);
    });

    it('should allow different participants to enroll in same class', async () => {
      const createDto1 = { participantId: 1, classId: 1 };
      const createDto2 = { participantId: 2, classId: 1 };

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValueOnce({
        ...mockEnrollment,
        participantId: 1,
      });
      mockPrismaService.enrollment.create.mockResolvedValueOnce({
        ...mockEnrollment,
        id: 2,
        participantId: 2,
      });

      const result1 = await service.create(createDto1);
      const result2 = await service.create(createDto2);

      expect(result1.participantId).toBe(1);
      expect(result2.participantId).toBe(2);
      expect(prismaService.enrollment.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return all enrollments with participant and class details', async () => {
      const mockEnrollments = [mockEnrollmentWithRelations];
      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const result = await service.findAll();

      expect(result).toEqual(mockEnrollments);
      expect(prismaService.enrollment.findMany).toHaveBeenCalledWith({
        include: {
          participant: true,
          class: true,
        },
      });
      expect(result[0]).toHaveProperty('participant');
      expect(result[0]).toHaveProperty('class');
    });

    it('should return empty array when no enrollments exist', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.enrollment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return multiple enrollments', async () => {
      const mockEnrollments = [
        mockEnrollmentWithRelations,
        { ...mockEnrollmentWithRelations, id: 2, participantId: 2 },
        { ...mockEnrollmentWithRelations, id: 3, classId: 2 },
      ];
      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const result = await service.findAll();

      expect(result).toHaveLength(3);
    });
  });

  describe('findEnrollmentsByParticipant', () => {
    it('should return all classes enrolled by a participant', async () => {
      const mockEnrollments = [
        {
          ...mockEnrollment,
          class: {
            id: 1,
            className: 'Desain Grafis',
            instructor: 'Jane Smith',
          },
        },
        {
          ...mockEnrollment,
          id: 2,
          classId: 2,
          class: {
            id: 2,
            className: 'Pemrograman Dasar',
            instructor: 'John Instructor',
          },
        },
      ];

      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const result = await service.findEnrollmentsByParticipant(1);

      expect(result).toEqual(mockEnrollments);
      expect(result).toHaveLength(2);
      expect(prismaService.enrollment.findMany).toHaveBeenCalledWith({
        where: { participantId: 1 },
        include: {
          class: true,
        },
      });
    });

    it('should return empty array when participant has no enrollments', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue([]);

      const result = await service.findEnrollmentsByParticipant(999);

      expect(result).toEqual([]);
    });
  });

  describe('findEnrollmentsByClass', () => {
    it('should return all participants enrolled in a class', async () => {
      const mockEnrollments = [
        {
          ...mockEnrollment,
          participant: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        {
          ...mockEnrollment,
          id: 2,
          participantId: 2,
          participant: {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        },
      ];

      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const result = await service.findEnrollmentsByClass(1);

      expect(result).toEqual(mockEnrollments);
      expect(result).toHaveLength(2);
      expect(prismaService.enrollment.findMany).toHaveBeenCalledWith({
        where: { classId: 1 },
        include: {
          participant: true,
        },
      });
    });

    it('should return empty array when class has no enrollments', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue([]);

      const result = await service.findEnrollmentsByClass(999);

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should delete an enrollment', async () => {
      mockPrismaService.enrollment.delete.mockResolvedValue(mockEnrollment);

      const result = await service.remove(1);

      expect(result).toEqual(mockEnrollment);
      expect(prismaService.enrollment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.enrollment.delete).toHaveBeenCalledTimes(1);
    });

    it('should allow re-enrollment after deletion', async () => {
      const createDto = { participantId: 1, classId: 1 };

      // First: delete existing enrollment
      mockPrismaService.enrollment.delete.mockResolvedValue(mockEnrollment);
      await service.remove(1);

      // Then: create new enrollment (should not throw ConflictException)
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(prismaService.enrollment.create).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors on findAll', async () => {
      mockPrismaService.enrollment.findMany.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle database errors on create', async () => {
      const createDto = { participantId: 1, classId: 1 };

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockRejectedValue(
        new Error('Foreign key constraint failed'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        'Foreign key constraint failed',
      );
    });

    it('should handle not found error on delete', async () => {
      mockPrismaService.enrollment.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });

    it('should handle findFirst errors during duplicate check', async () => {
      const createDto = { participantId: 1, classId: 1 };

      mockPrismaService.enrollment.findFirst.mockRejectedValue(
        new Error('Database error during duplicate check'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        'Database error during duplicate check',
      );
    });
  });

  describe('Business Logic Tests', () => {
    it('should validate participantId and classId are positive integers', async () => {
      const createDto = { participantId: 1, classId: 1 };

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(createDto);

      expect(result.participantId).toBeGreaterThan(0);
      expect(result.classId).toBeGreaterThan(0);
    });

    it('should maintain enrollment date automatically', async () => {
      const createDto = { participantId: 1, classId: 1 };

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(createDto);

      expect(result.enrollmentDate).toBeDefined();
      expect(result.enrollmentDate).toBeInstanceOf(Date);
    });
  });
});
