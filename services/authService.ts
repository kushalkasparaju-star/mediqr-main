
import { User, Patient, Role, UploadedFile } from '../types';
import { createPatient } from './patientService';

const USERS_KEY = 'mediqr_users';
const SESSION_KEY = 'mediqr_session';

// Helper to get users from localStorage
const getUsers = (): (User & { passwordHash: string })[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: (User & { passwordHash: string })[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerPatient = (patientData: Omit<Patient, 'id' | 'medicalRecords'>, password: string, initialRecords: UploadedFile[] = []): Patient | null => {
    const users = getUsers();
    if (users.some(u => u.email === patientData.email)) {
        alert('An account with this email already exists.');
        return null;
    }

    const newPatient = createPatient(patientData, initialRecords);
    if (!newPatient) return null;

    const newUser: User & { passwordHash: string } = {
        email: newPatient.email,
        role: 'patient',
        patientId: newPatient.id,
        passwordHash: password, // In a real app, this should be hashed
    };

    saveUsers([...users, newUser]);
    return newPatient;
};

export const login = (email: string, password: string, role: Role): User | null => {
    // Seed hospital user if not exists
    let users = getUsers();
    if (!users.some(u => u.role === 'hospital')) {
        users.push({ email: 'doctor@hospital.com', passwordHash: 'password123', role: 'hospital' });
        saveUsers(users);
    }

    const user = users.find(u => u.email === email && u.role === role);

    if (user && user.passwordHash === password) { // Plain text check for simulation
        const sessionUser: User = { email: user.email, role: user.role, patientId: user.patientId };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return sessionUser;
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

// QR-based login: Login patient using their patient ID
export const loginByPatientId = (patientId: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.patientId === patientId && u.role === 'patient');
    
    if (user) {
        const sessionUser: User = { email: user.email, role: user.role, patientId: user.patientId };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        // Store last scanned patient ID for demo re-login
        localStorage.setItem('mediqr_last_scanned_patient', patientId);
        return sessionUser;
    }
    return null;
};
