
import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PatientRegistration from './pages/PatientRegistration';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { getCurrentUser, logout } from './services/authService';
import { User, Page } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('HOME');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const checkSession = useCallback(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            if (user.role === 'patient') {
                setCurrentPage('PATIENT_DASHBOARD');
            } else {
                setCurrentPage('HOSPITAL_DASHBOARD');
            }
        } else {
            setCurrentPage('HOME');
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setCurrentPage('HOME');
    };

    const renderPage = () => {
        if (currentUser) {
            switch (currentPage) {
                case 'PATIENT_DASHBOARD':
                    return <PatientDashboard user={currentUser} />;
                case 'HOSPITAL_DASHBOARD':
                    return <HospitalDashboard />;
                default:
                    // If logged in, default to their dashboard
                    return currentUser.role === 'patient' ? <PatientDashboard user={currentUser} /> : <HospitalDashboard />;
            }
        }

        switch (currentPage) {
            case 'LOGIN':
                return <LoginPage setCurrentPage={setCurrentPage} onLoginSuccess={checkSession} />;
            case 'REGISTER':
                return <PatientRegistration setCurrentPage={setCurrentPage} />;
            case 'HOME':
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <Header
                isLoggedIn={!!currentUser}
                onLogout={handleLogout}
                setCurrentPage={setCurrentPage}
                userRole={currentUser?.role}
            />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
