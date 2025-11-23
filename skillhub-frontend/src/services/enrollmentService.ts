/**
 * Service untuk komunikasi dengan API backend manajemen enrollment
 * Mengelola relasi many-to-many antara peserta dan kelas
 */
import axios from 'axios';
import type { Enrollment } from '../types/enrollment';

// Base URL untuk API endpoints enrollment
const API_URL = 'http://localhost:3000/enrollments';

/**
 * Tipe data untuk membuat enrollment baru
 */
export type EnrollmentCreationData = {
  participantId: number;
  classId: number;
};

/**
 * Mengambil daftar semua enrollment dari backend
 * @returns Promise<Enrollment[]> - Array berisi semua enrollment dengan data participant dan class
 */
export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Membuat enrollment baru (mendaftarkan peserta ke kelas)
 * @param enrollmentData - Data enrollment (participantId, classId)
 * @returns Promise<Enrollment> - Data enrollment yang berhasil dibuat
 * @throws Error - Jika peserta sudah terdaftar di kelas tersebut (409 Conflict)
 */
export const createEnrollment = async (enrollmentData: EnrollmentCreationData): Promise<Enrollment> => {
  const response = await axios.post(API_URL, enrollmentData);
  return response.data;
};

/**
 * Menghapus enrollment (membatalkan pendaftaran)
 * @param id - ID enrollment yang akan dihapus
 * @returns Promise<void>
 */
export const deleteEnrollment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

/**
 * Mengambil daftar peserta yang terdaftar di suatu kelas
 * @param classId - ID kelas
 * @returns Promise<Enrollment[]> - Array enrollment dengan data participant
 */
export const findEnrollmentsByClass = async (classId: number): Promise<Enrollment[]> => {
  const response = await axios.get(`${API_URL}/class/${classId}`);
  return response.data;
};

/**
 * Mengambil daftar kelas yang diikuti oleh seorang peserta
 * @param participantId - ID peserta
 * @returns Promise<Enrollment[]> - Array enrollment dengan data class
 */
export const findEnrollmentsByParticipant = async (participantId: number): Promise<Enrollment[]> => {
  const response = await axios.get(`${API_URL}/participant/${participantId}`);
  return response.data;
};
