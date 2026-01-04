import { Patient, UploadedFile } from '../types';

const PATIENTS_KEY = 'mediqr_patients';

// Helper to get patients from localStorage
const getPatients = (): Patient[] => {
    const patients = localStorage.getItem(PATIENTS_KEY);
    return patients ? JSON.parse(patients) : [];
};

// Helper to save patients to localStorage
const savePatients = (patients: Patient[]) => {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const createPatient = (patientData: Omit<Patient, 'id' | 'medicalRecords'>, initialRecords: UploadedFile[] = []): Patient => {
    const patients = getPatients();
    const newPatient: Patient = {
        ...patientData,
        id: `MEDI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        medicalRecords: initialRecords.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    };
    savePatients([...patients, newPatient]);
    return newPatient;
};

export const getPatientById = (id: string): Patient | null => {
    const patients = getPatients();
    return patients.find(p => p.id === id) || null;
};

export const updatePatient = (updatedPatient: Patient): Patient | null => {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
        patients[index] = updatedPatient;
        savePatients(patients);
        return updatedPatient;
    }
    return null;
};

export const addMedicalRecord = (patientId: string, file: UploadedFile): Patient | null => {
    const patient = getPatientById(patientId);
    if (patient) {
        patient.medicalRecords.push(file);
        // Sort records by date, newest first
        patient.medicalRecords.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        return updatePatient(patient);
    }
    return null;
};