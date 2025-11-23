// src/types/enrollment.ts
import type { Participant } from './participant';
import type { Class } from './class';

export interface Enrollment {
    id: number;
    participantId: number;
    classId: number;
    enrollmentDate: string; // ISO string

    // Relations (included from PrismaService)
    participant: Participant;
    class: Class;
}
