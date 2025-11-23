// src/types/class.ts
import type { Enrollment } from './enrollment';

export interface Class {
    id: number;
    className: string;
    description?: string;
    instructor: string;
    createdAt: string; // ISO string
    // Assuming enrollments will be handled separately or included if specified in service
    enrollments?: Enrollment[]; // Placeholder for now
}