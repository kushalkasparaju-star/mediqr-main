
import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, QrCodeSuccessCallback } from 'html5-qrcode';
import { login, loginByPatientId } from '../services/authService';
import { Page, Role } from '../types';
import { QrCodeIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface LoginPageProps {
    setCurrentPage: (page: Page) => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('patient');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showDemoInfo, setShowDemoInfo] = useState(false);
    const [qrScanError, setQrScanError] = useState<string | null>(null);
    const [hasLastScanned, setHasLastScanned] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    
    // Check for last scanned patient ID
    useEffect(() => {
        const lastScanned = localStorage.getItem('mediqr_last_scanned_patient');
        setHasLastScanned(!!lastScanned);
    }, []);

    // Initialize QR Scanner when showQRScanner is true
    useEffect(() => {
        if (!showQRScanner || role !== 'patient') return;

        const scanner = new Html5QrcodeScanner(
            'qr-scanner',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );

        scannerRef.current = scanner;

        const onScanSuccess: QrCodeSuccessCallback = (decodedText) => {
            if (decodedText.startsWith('MEDI-')) {
                setQrScanError(null);
                const user = loginByPatientId(decodedText);
                if (user) {
                    setHasLastScanned(true);
                    scanner.clear().catch(error => console.error("Failed to clear scanner", error));
                    onLoginSuccess();
                } else {
                    setQrScanError('Invalid QR code. Patient not found.');
                    setTimeout(() => setQrScanError(null), 3000);
                }
            } else {
                setQrScanError('Invalid MediQR code. Please scan a valid patient QR code.');
                setTimeout(() => setQrScanError(null), 3000);
            }
        };

        const onScanFailure = (error: string) => {
            // Silently handle scan failures (camera not ready, etc.)
            if (error && !error.includes('No QR code found')) {
                // Only log non-expected errors
            }
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner on unmount", error));
            scannerRef.current = null;
        };
    }, [showQRScanner, role, onLoginSuccess]);

    const handleQRLoginFromLastScanned = () => {
        const lastScanned = localStorage.getItem('mediqr_last_scanned_patient');
        if (lastScanned) {
            const user = loginByPatientId(lastScanned);
            if (user) {
                onLoginSuccess();
            } else {
                setError('Last scanned patient not found. Please scan again.');
                setHasLastScanned(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Demo hospital credentials hint
        if (role === 'hospital' && email === '' && password === '') {
          setEmail('doctor@hospital.com');
          setPassword('password123');
        }

        setTimeout(() => { // Simulate network delay
            const user = login(email, password, role);
            if (user) {
                onLoginSuccess();
            } else {
                setError('Invalid credentials. Please try again.');
                setLoading(false);
            }
        }, 500);
    };

    const toggleQRScanner = () => {
        setShowQRScanner(!showQRScanner);
        setQrScanError(null);
        if (!showQRScanner && scannerRef.current) {
            // Scanner will initialize via useEffect
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to MediQR</h2>
                
                {/* Demo Credentials Info - Collapsible */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowDemoInfo(!showDemoInfo)}
                        className="w-full flex items-center justify-between text-left text-xs text-gray-500 hover:text-gray-700 bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                        <span className="flex items-center">
                            <InformationCircleIcon className="w-4 h-4 mr-1" />
                            <span>For hospital access, use demo credentials</span>
                        </span>
                        {showDemoInfo ? (
                            <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                        )}
                    </button>
                    {showDemoInfo && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                            <p className="font-semibold mb-1">Hospital Demo Credentials:</p>
                            <p className="font-mono">doctor@hospital.com / password123</p>
                        </div>
                    )}
                </div>

                <div className="mb-6 flex justify-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => {
                            setRole('patient');
                            setShowQRScanner(false);
                            setQrScanError(null);
                        }}
                        className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${role === 'patient' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                    >
                        Patient
                    </button>
                    <button
                        onClick={() => {
                            setRole('hospital');
                            setShowQRScanner(false);
                            setQrScanError(null);
                        }}
                        className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${role === 'hospital' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                    >
                        Hospital
                    </button>
                </div>

                {/* QR Scanner Section - Only for Patient role */}
                {role === 'patient' && (
                    <div className="mb-6">
                        <button
                            onClick={toggleQRScanner}
                            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                        >
                            <QrCodeIcon className="w-5 h-5 mr-2" />
                            {showQRScanner ? 'Close QR Scanner' : 'Scan QR Code to Login'}
                        </button>
                        
                        {showQRScanner && (
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                                <p className="text-sm text-gray-600 mb-3 text-center">Position your QR code within the frame</p>
                                <div id="qr-scanner" className="w-full mx-auto border-2 rounded-lg overflow-hidden bg-white"></div>
                                {qrScanError && (
                                    <p className="text-red-500 text-sm mt-3 text-center">{qrScanError}</p>
                                )}
                            </div>
                        )}

                        {/* Last Scanned Patient Quick Login */}
                        {hasLastScanned && !showQRScanner && (
                            <button
                                onClick={handleQRLoginFromLastScanned}
                                className="w-full mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
                            >
                                Use Last Scanned Patient QR
                            </button>
                        )}

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">OR</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email/Password Login Form */}
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-teal-300"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                 <p className="text-center text-gray-600 mt-6">
                    Don't have a patient account?{' '}
                    <button onClick={() => setCurrentPage('REGISTER')} className="text-teal-500 hover:underline font-semibold">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
