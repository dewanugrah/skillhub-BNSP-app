import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

/**
 * Service untuk mengelola pendaftaran peserta ke kelas (enrollment)
 * Mengimplementasikan relasi many-to-many antara Participant dan Class
 */
@Injectable()
export class EnrollmentService {
  /**
   * Constructor dengan dependency injection PrismaService
   * @param prisma - Service untuk akses database melalui Prisma ORM
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Membuat enrollment baru (mendaftarkan peserta ke kelas)
   * Melakukan pengecekan duplikasi untuk mencegah peserta mendaftar ke kelas yang sama 2x
   * @param createEnrollmentDto - DTO berisi participantId dan classId
   * @returns Promise<Enrollment> - Data enrollment yang berhasil dibuat
   * @throws ConflictException - Jika peserta sudah terdaftar di kelas tersebut
   */
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // Cek apakah enrollment sudah ada (duplicate prevention)
    const existing = await this.prisma.enrollment.findFirst({
      where: {
        participantId: createEnrollmentDto.participantId,
        classId: createEnrollmentDto.classId,
      },
    });

    if (existing) {
      throw new ConflictException('Peserta sudah terdaftar di kelas ini.');
    }

    return this.prisma.enrollment.create({ data: createEnrollmentDto });
  }

  /**
   * Mengambil semua data enrollment beserta informasi participant dan class
   * @returns Promise<Enrollment[]> - Daftar semua enrollment dengan relasi participant dan class
   */
  findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        participant: true,
        class: true,
      },
    });
  }

  /**
   * Mengambil daftar kelas yang diikuti oleh seorang peserta tertentu
   * @param participantId - ID peserta yang akan dicari enrollmentnya
   * @returns Promise<Enrollment[]> - Daftar enrollment beserta informasi kelas
   */
  findEnrollmentsByParticipant(participantId: number) {
    return this.prisma.enrollment.findMany({
      where: { participantId },
      include: {
        class: true,
      },
    });
  }

  /**
   * Mengambil daftar peserta yang terdaftar pada suatu kelas tertentu
   * @param classId - ID kelas yang akan dicari enrollmentnya
   * @returns Promise<Enrollment[]> - Daftar enrollment beserta informasi peserta
   */
  findEnrollmentsByClass(classId: number) {
    return this.prisma.enrollment.findMany({
      where: { classId },
      include: {
        participant: true,
      },
    });
  }

  /**
   * Menghapus enrollment (membatalkan pendaftaran peserta dari kelas)
   * @param id - ID enrollment yang akan dihapus
   * @returns Promise<Enrollment> - Data enrollment yang berhasil dihapus
   */
  remove(id: number) {
    return this.prisma.enrollment.delete({ where: { id } });
  }
}

