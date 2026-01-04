
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, QrCodeSuccessCallback } from 'html5-qrcode';
import PatientProfileView from './PatientProfileView';

const HospitalDashboard: React.FC = () => {
    const [scannedPatientId, setScannedPatientId] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

    useEffect(() => {
        if (scannedPatientId) return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );

        const onScanSuccess: QrCodeSuccessCallback = (decodedText, decodedResult) => {
            console.log(`Scan result: ${decodedText}`, decodedResult);
            if (decodedText.startsWith('MEDI-')) {
                setScannedPatientId(decodedText);
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            } else {
                setScanError("Invalid MediQR code detected. Please scan a valid patient QR code.");
            }
        };

        const onScanFailure = (error: string) => {
            // console.warn(`Code scan error = ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner on unmount", error));
        };
    }, [scannedPatientId]);

    const handleScanAnother = () => {
        setScannedPatientId(null);
        setScanError(null);
    };

    if (scannedPatientId) {
        return <PatientProfileView patientId={scannedPatientId} onScanAnother={handleScanAnother} />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Scan Patient QR Code</h2>
                <p className="text-gray-600 mb-6">Position the patient's QR code within the frame to securely access their medical records.</p>
                <div id="qr-reader" className="w-full md:w-[500px] mx-auto border-2 rounded-lg overflow-hidden"></div>
                {scanError && <p className="text-red-500 mt-4">{scanError}</p>}
            </div>
        </div>
    );
};

export default HospitalDashboard;
