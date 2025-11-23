/**
 * Service untuk komunikasi dengan API backend manajemen kelas pelatihan
 * Menggunakan axios untuk HTTP requests
 */
import axios from 'axios';
import type { Class } from '../types/class';

// Base URL untuk API endpoints kelas
const API_URL = 'http://localhost:3000/classes';

/**
 * Tipe data untuk membuat kelas baru
 * Omit ID dan timestamps karena akan di-generate oleh backend
 */
export type ClassCreationData = Omit<Class, 'id' | 'createdAt' | 'enrollments'>;

/**
 * Tipe data untuk update kelas (partial update)
 */
export type ClassUpdateData = Partial<ClassCreationData>;

/**
 * Mengambil daftar semua kelas pelatihan dari backend
 * @returns Promise<Class[]> - Array berisi semua kelas
 */
export const getClasses = async (): Promise<Class[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Membuat kelas pelatihan baru
 * @param classData - Data kelas (className, description, instructor)
 * @returns Promise<Class> - Data kelas yang berhasil dibuat
 */
export const createClass = async (classData: ClassCreationData): Promise<Class> => {
  const response = await axios.post(API_URL, classData);
  return response.data;
};

/**
 * Mengupdate data kelas yang sudah ada
 * @param id - ID kelas yang akan diupdate
 * @param classData - Data yang akan diupdate (partial update supported)
 * @returns Promise<Class> - Data kelas yang telah diupdate
 */
export const updateClass = async (id: number, classData: ClassUpdateData): Promise<Class> => {
  const response = await axios.patch(`${API_URL}/${id}`, classData);
  return response.data;
};

/**
 * Mengambil detail satu kelas berdasarkan ID
 * @param id - ID kelas yang akan dicari
 * @returns Promise<Class> - Data lengkap kelas
 */
export const getClassById = async (id: number): Promise<Class> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Menghapus kelas dari database
 * @param id - ID kelas yang akan dihapus
 * @returns Promise<void>
 */
export const deleteClass = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
