export interface Participant {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string; // Make it optional to match the schema
    address?: string; // Make it optional to match the schema
    createdAt: string;
    updatedAt: string;
}