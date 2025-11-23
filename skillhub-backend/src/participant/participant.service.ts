import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Service untuk mengelola data peserta (participant)
 * Menyediakan operasi CRUD untuk entitas Participant
 */
@Injectable()
export class ParticipantService {
  /**
   * Constructor dengan dependency injection PrismaService
   * @param prisma - Service untuk akses database melalui Prisma ORM
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Mengambil semua data peserta beserta enrollment yang terkait
   * @returns Promise<Participant[]> - Daftar semua peserta dengan relasi enrollments
   */
  findAll() {
    return this.prisma.participant.findMany({
      include: { enrollments: true },
    });
  }

  /**
   * Mengambil detail satu peserta berdasarkan ID
   * Termasuk semua enrollment dan informasi kelas yang diikuti
   * @param id - ID peserta yang akan dicari
   * @returns Promise<Participant | null> - Data peserta dengan enrollments dan class, atau null jika tidak ditemukan
   */
  findOne(id: number) {
    return this.prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { class: true },
        },
      },
    });
  }

  /**
   * Membuat peserta baru
   * @param data - Data peserta yang akan dibuat (name, email, phoneNumber, address)
   * @returns Promise<Participant> - Data peserta yang berhasil dibuat
   */
  create(data: Prisma.ParticipantCreateInput) {
    return this.prisma.participant.create({ data });
  }

  /**
   * Mengupdate data peserta yang sudah ada
   * @param id - ID peserta yang akan diupdate
   * @param data - Data peserta yang akan diupdate (partial update supported)
   * @returns Promise<Participant> - Data peserta yang berhasil diupdate
   */
  update(id: number, data: Prisma.ParticipantUpdateInput) {
    return this.prisma.participant.update({
      where: { id },
      data,
    });
  }

  /**
   * Menghapus peserta dari database
   * Catatan: Enrollment terkait akan di-cascade delete secara otomatis
   * @param id - ID peserta yang akan dihapus
   * @returns Promise<Participant> - Data peserta yang berhasil dihapus
   */
  delete(id: number) {
    return this.prisma.participant.delete({ where: { id } });
  }
}
