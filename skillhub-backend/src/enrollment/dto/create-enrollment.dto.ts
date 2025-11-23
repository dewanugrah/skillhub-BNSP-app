// src/enrollment/dto/create-enrollment.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) untuk mendaftarkan peserta ke kelas
 * Menggunakan class-validator decorators untuk validasi otomatis
 */
export class CreateEnrollmentDto {
  /**
   * ID peserta yang akan didaftarkan
   * Wajib diisi, harus berupa integer
   * Foreign key ke tabel Participant
   */
  @IsInt()
  @IsNotEmpty()
  participantId: number;

  /**
   * ID kelas yang akan diikuti
   * Wajib diisi, harus berupa integer
   * Foreign key ke tabel Class
   */
  @IsInt()
  @IsNotEmpty()
  classId: number;
}
