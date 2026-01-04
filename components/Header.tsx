
import React from 'react';
import { Page, Role } from '../types';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    setCurrentPage: (page: Page) => void;
    userRole?: Role;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, setCurrentPage, userRole }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div 
                    className="text-2xl font-bold text-teal-600 cursor-pointer"
                    onClick={() => setCurrentPage(isLoggedIn ? (userRole === 'patient' ? 'PATIENT_DASHBOARD' : 'HOSPITAL_DASHBOARD') : 'HOME')}
                >
                    Medi<span className="text-blue-500">QR</span>
                </div>
                <nav>
                    {isLoggedIn ? (
                        <button
                            onClick={onLogout}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="space-x-2">
                             <button
                                onClick={() => setCurrentPage('LOGIN')}
                                className="text-teal-600 font-semibold py-2 px-4"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setCurrentPage('REGISTER')}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
