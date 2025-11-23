// src/class/dto/create-class.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO (Data Transfer Object) untuk membuat kelas pelatihan baru
 * Menggunakan class-validator decorators untuk validasi otomatis
 */
export class CreateClassDto {
  /**
   * Nama kelas pelatihan (contoh: "Desain Grafis", "Pemrograman Dasar")
   * Wajib diisi, harus berupa string
   */
  @IsString()
  @IsNotEmpty()
  className: string;

  /**
   * Deskripsi singkat tentang kelas pelatihan
   * Opsional, harus berupa string jika diisi
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Nama instruktur yang mengajar kelas ini
   * Wajib diisi, harus berupa string
   */
  @IsString()
  @IsNotEmpty()
  instructor: string;
}
