export type Role = 'patient' | 'hospital';

export type Page = 'HOME' | 'LOGIN' | 'REGISTER' | 'PATIENT_DASHBOARD' | 'HOSPITAL_DASHBOARD';

export interface User {
    email: string;
    role: Role;
    patientId?: string; // Only for patients
}

export interface UploadedFile {
    name: string;
    type: string;
    data: string; // base64 encoded string
    uploadedAt: string;
    author: 'patient' | 'hospital';
}

export interface Patient {
    id: string; // MEDI-XXXXXX
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    contact: string;
    email: string;
    address: string;
    medicalRecords: UploadedFile[];
}