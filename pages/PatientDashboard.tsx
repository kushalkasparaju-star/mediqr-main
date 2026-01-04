import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: Use named export for QRCode component as default export is deprecated.
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getPatientById, addMedicalRecord } from '../services/patientService';
import { User, Patient, UploadedFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { DocumentArrowDownIcon, DocumentPlusIcon, UserCircleIcon, QrCodeIcon } from '@heroicons/react/24/outline';

interface PatientDashboardProps {
    user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const fetchPatientData = useCallback(() => {
        if (user.patientId) {
            setLoading(true);
            const data = getPatientById(user.patientId);
            setPatient(data);
            setLoading(false);
        }
    }, [user.patientId]);

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFilesToUpload(Array.from(e.target.files));
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (filesToUpload.length === 0 || !patient) return;

        setUploading(true);
        for (const file of filesToUpload) {
            const base64Data = await fileToBase64(file);
            const newRecord: UploadedFile = {
                name: file.name,
                type: file.type,
                data: base64Data,
                uploadedAt: new Date().toISOString(),
                author: 'patient',
            };
            addMedicalRecord(patient.id, newRecord);
        }
        setUploading(false);
        setFilesToUpload([]);
        fetchPatientData(); // Refresh data
    };

    const downloadQRCode = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `MediQR-${patient?.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };
    
    if (loading) return <p className="text-center text-lg">Loading patient data...</p>;
    if (!patient) return <p className="text-center text-lg text-red-500">Could not find patient data.</p>;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: QR and Info */}
            <div className="lg:col-span-1 space-y-8">
                {/* QR Code Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center"><QrCodeIcon className="w-8 h-8 mr-2 text-teal-500" />Your MediQR Code</h3>
                    <div ref={qrRef} className="flex justify-center mb-4 p-4 border rounded-lg">
                        <QRCode value={patient.id} size={256} level="H" />
                    </div>
                    <button onClick={downloadQRCode} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Download QR
                    </button>
                    <p className="text-sm text-gray-500 mt-4">Present this code at any registered hospital for instant access to your records.</p>
                </div>
                
                {/* Patient Info Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><UserCircleIcon className="w-8 h-8 mr-2 text-teal-500"/>Patient Details</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Patient ID:</strong> {patient.id}</p>
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Contact:</strong> {patient.contact}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Records and Upload */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><DocumentPlusIcon className="w-8 h-8 mr-2 text-teal-500" />Medical Records</h3>
                    
                    {/* Upload Form */}
                    <form onSubmit={handleFileUpload} className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-dashed border-blue-200">
                        <h4 className="font-semibold text-lg mb-2">Upload New Documents</h4>
                        <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                        <button type="submit" disabled={uploading || filesToUpload.length === 0} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300">
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>

                    {/* Records List */}
                    <div className="space-y-3">
                        {patient.medicalRecords.length > 0 ? (
                            patient.medicalRecords.map((record, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                                    <div>
                                        <p className="font-semibold">{record.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Uploaded by <span className="font-medium capitalize">{record.author}</span> on {new Date(record.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <a href={record.data} download={record.name} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-lg text-sm">Download</a>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No medical records uploaded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;