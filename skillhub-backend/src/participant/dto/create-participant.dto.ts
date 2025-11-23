// src/participant/dto/create-participant.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO (Data Transfer Object) untuk membuat peserta baru
 * Menggunakan class-validator decorators untuk validasi otomatis
 */
export class CreateParticipantDto {
  /**
   * Nama lengkap peserta
   * Wajib diisi, harus berupa string
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Alamat email peserta
   * Wajib diisi, harus format email yang valid
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Nomor telepon peserta
   * Opsional, harus berupa string jika diisi
   */
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  /**
   * Alamat lengkap peserta
   * Opsional, harus berupa string jika diisi
   */
  @IsString()
  @IsOptional()
  address?: string;
}