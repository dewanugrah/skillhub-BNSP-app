import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from './class.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Unit tests untuk ClassService
 * Menggunakan mock PrismaService untuk menghindari database dependencies
 */
describe('ClassService', () => {
  let service: ClassService;
  let prismaService: PrismaService;

  // Mock data untuk testing
  const mockClass = {
    id: 1,
    className: 'Desain Grafis',
    description: 'Belajar desain grafis dari dasar',
    instructor: 'Jane Smith',
    createdAt: new Date(),
  };

  const mockClassWithEnrollments = {
    ...mockClass,
    enrollments: [
      {
        id: 1,
        participantId: 1,
        classId: 1,
        enrollmentDate: new Date(),
      },
    ],
  };

  // Mock PrismaService
  const mockPrismaService = {
    class: {
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
        ClassService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      const mockClasses = [mockClass, { ...mockClass, id: 2, className: 'Pemrograman Dasar' }];
      mockPrismaService.class.findMany.mockResolvedValue(mockClasses);

      const result = await service.findAll();

      expect(result).toEqual(mockClasses);
      expect(result).toHaveLength(2);
      expect(prismaService.class.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no classes exist', async () => {
      mockPrismaService.class.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.class.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a class by id', async () => {
      mockPrismaService.class.findUnique.mockResolvedValue(mockClass);

      const result = await service.findOne(1);

      expect(result).toEqual(mockClass);
      expect(prismaService.class.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when class not found', async () => {
      mockPrismaService.class.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(prismaService.class.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('create', () => {
    it('should create a new class with all fields', async () => {
      const createDto = {
        className: 'Desain Grafis',
        description: 'Belajar desain grafis dari dasar',
        instructor: 'Jane Smith',
      };

      mockPrismaService.class.create.mockResolvedValue(mockClass);

      const result = await service.create(createDto);

      expect(result).toEqual(mockClass);
      expect(prismaService.class.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(prismaService.class.create).toHaveBeenCalledTimes(1);
    });

    it('should create class without optional description', async () => {
      const createDto = {
        className: 'Pemrograman Dasar',
        instructor: 'John Doe',
      };

      const mockResult = {
        id: 2,
        className: 'Pemrograman Dasar',
        description: null,
        instructor: 'John Doe',
        createdAt: new Date(),
      };

      mockPrismaService.class.create.mockResolvedValue(mockResult);

      const result = await service.create(createDto);

      expect(result).toEqual(mockResult);
      expect(result.description).toBeNull();
      expect(result.className).toBe('Pemrograman Dasar');
    });

    it('should create different types of classes', async () => {
      const classes = [
        { className: 'Editing Video', instructor: 'Video Pro' },
        { className: 'Public Speaking', instructor: 'Speaker Master' },
      ];

      for (const classDto of classes) {
        const mockResult = { id: 1, ...classDto, description: null, createdAt: new Date() };
        mockPrismaService.class.create.mockResolvedValue(mockResult);

        const result = await service.create(classDto);

        expect(result.className).toBe(classDto.className);
        expect(result.instructor).toBe(classDto.instructor);
      }
    });
  });

  describe('update', () => {
    it('should update an existing class', async () => {
      const updateDto = {
        className: 'Desain Grafis Advanced',
        description: 'Materi lanjutan desain grafis',
      };

      const updatedClass = {
        ...mockClass,
        ...updateDto,
      };

      mockPrismaService.class.update.mockResolvedValue(updatedClass);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedClass);
      expect(result.className).toBe('Desain Grafis Advanced');
      expect(result.description).toBe('Materi lanjutan desain grafis');
      expect(prismaService.class.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should update only instructor field', async () => {
      const updateDto = {
        instructor: 'New Instructor',
      };

      const updatedClass = {
        ...mockClass,
        instructor: 'New Instructor',
      };

      mockPrismaService.class.update.mockResolvedValue(updatedClass);

      const result = await service.update(1, updateDto);

      expect(result.instructor).toBe('New Instructor');
      expect(result.className).toBe(mockClass.className);
      expect(prismaService.class.update).toHaveBeenCalledTimes(1);
    });

    it('should allow partial updates', async () => {
      const updateDto = {
        description: 'Updated description only',
      };

      mockPrismaService.class.update.mockResolvedValue({
        ...mockClass,
        description: 'Updated description only',
      });

      const result = await service.update(1, updateDto);

      expect(result.description).toBe('Updated description only');
    });
  });

  describe('remove', () => {
    it('should delete a class', async () => {
      mockPrismaService.class.delete.mockResolvedValue(mockClass);

      const result = await service.remove(1);

      expect(result).toEqual(mockClass);
      expect(prismaService.class.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.class.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion of class with enrollments (cascade)', async () => {
      mockPrismaService.class.delete.mockResolvedValue(mockClassWithEnrollments);

      const result = await service.remove(1);

      expect(result).toBeDefined();
      expect(prismaService.class.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors on findAll', async () => {
      mockPrismaService.class.findMany.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should handle database errors on create', async () => {
      const createDto = {
        className: 'Test Class',
        instructor: 'Test Instructor',
      };

      mockPrismaService.class.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });

    it('should handle not found error on update', async () => {
      mockPrismaService.class.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update(999, { className: 'Test' })).rejects.toThrow(
        'Record not found',
      );
    });

    it('should handle not found error on delete', async () => {
      mockPrismaService.class.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });

    it('should handle constraint violations', async () => {
      const createDto = {
        className: 'Duplicate Class',
        instructor: 'Instructor',
      };

      mockPrismaService.class.create.mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        'Unique constraint failed',
      );
    });
  });
});
