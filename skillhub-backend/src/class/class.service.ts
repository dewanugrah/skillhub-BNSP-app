import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

/**
 * Service untuk mengelola data kelas pelatihan
 * Menyediakan operasi CRUD untuk entitas Class
 */
@Injectable()
export class ClassService {
  /**
   * Constructor dengan dependency injection PrismaService
   * @param prisma - Service untuk akses database melalui Prisma ORM
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Membuat kelas pelatihan baru
   * @param createClassDto - DTO berisi data kelas (className, description, instructor)
   * @returns Promise<Class> - Data kelas yang berhasil dibuat
   */
  create(createClassDto: CreateClassDto) {
    return this.prisma.class.create({ data: createClassDto });
  }

  /**
   * Mengambil semua data kelas pelatihan
   * @returns Promise<Class[]> - Daftar semua kelas pelatihan
   */
  findAll() {
    return this.prisma.class.findMany();
  }

  /**
   * Mengambil detail satu kelas berdasarkan ID
   * @param id - ID kelas yang akan dicari
   * @returns Promise<Class | null> - Data kelas atau null jika tidak ditemukan
   */
  findOne(id: number) {
    return this.prisma.class.findUnique({ where: { id } });
  }

  /**
   * Mengupdate data kelas yang sudah ada
   * @param id - ID kelas yang akan diupdate
   * @param updateClassDto - DTO berisi data yang akan diupdate (partial update supported)
   * @returns Promise<Class> - Data kelas yang berhasil diupdate
   */
  update(id: number, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
    });
  }

  /**
   * Menghapus kelas dari database
   * Catatan: Enrollment terkait akan di-cascade delete secara otomatis
   * @param id - ID kelas yang akan dihapus
   * @returns Promise<Class> - Data kelas yang berhasil dihapus
   */
  remove(id: number) {
    return this.prisma.class.delete({ where: { id } });
  }
}

