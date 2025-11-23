/**
 * Service untuk komunikasi dengan API backend manajemen peserta
 * Menggunakan axios untuk HTTP requests
 */
import axios from 'axios';
import type { Participant } from "../types/participant";

// Base URL untuk API endpoints peserta
const API_URL = 'http://localhost:3000/participants';

/**
 * Tipe data untuk membuat peserta baru
 * Omit ID dan timestamps karena akan di-generate oleh backend
 */
export type ParticipantCreationData = Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'enrollments'>;

/**
 * Mengambil daftar semua peserta dari backend
 * @returns Promise<Participant[]> - Array berisi semua peserta
 */
export const getParticipants = async (): Promise<Participant[]> => {
    const response = await axios.get(API_URL);
    return response.data
}

/**
 * Membuat peserta baru
 * @param participantData - Data peserta (name, email, phoneNumber, address)
 * @returns Promise<Participant> - Data peserta yang berhasil dibuat
 */
export const createParticipant = async (participantData: ParticipantCreationData): Promise<Participant> => {
    const response = await axios.post(API_URL, participantData);
    return response.data;
}

/**
 * Mengupdate data peserta yang sudah ada
 * @param id - ID peserta yang akan diupdate
 * @param participantData - Data yang akan diupdate (partial update supported)
 * @returns Promise<Participant> - Data peserta yang telah diupdate
 */
export const updateParticipant = async (id: number, participantData: Partial<ParticipantCreationData>): Promise<Participant> => {
    const response = await axios.patch(`${API_URL}/${id}`, participantData);
    return response.data;
}

/**
 * Mengambil detail satu peserta berdasarkan ID
 * @param id - ID peserta yang akan dicari
 * @returns Promise<Participant> - Data lengkap peserta
 */
export const getParticipantById = async (id: number): Promise<Participant> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

/**
 * Menghapus peserta dari database
 * @param id - ID peserta yang akan dihapus
 * @returns Promise<void>
 */
export const deleteParticipant = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}