import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getPatientById, addMedicalRecord } from '../services/patientService';
import { Patient, UploadedFile } from '../types';
import { UserIcon, DocumentTextIcon, ArrowPathIcon, PlusCircleIcon, QrCodeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { fileToBase64 } from '../utils/fileUtils';


interface PatientProfileViewProps {
    patientId: string;
    onScanAnother: () => void;
}

const PatientProfileView: React.FC<PatientProfileViewProps> = ({ patientId, onScanAnother }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const fetchPatientData = useCallback(() => {
        const data = getPatientById(patientId);
        setPatient(data);
    }, [patientId]);

    useEffect(() => {
        setLoading(true);
        fetchPatientData();
        setLoading(false);
    }, [fetchPatientData]);
    
    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileToUpload || !patient) return;

        setUploading(true);
        const base64Data = await fileToBase64(fileToUpload);
        const newRecord: UploadedFile = {
            name: fileToUpload.name,
            type: fileToUpload.type,
            data: base64Data,
            uploadedAt: new Date().toISOString(),
            author: 'hospital',
        };
        
        addMedicalRecord(patient.id, newRecord);
        
        fetchPatientData(); // Re-fetch to update the list
        setUploading(false);
        setFileToUpload(null);
        setShowUpload(false);
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

    if (loading) return <p className="text-center text-lg">Fetching patient data...</p>;
    if (!patient) return (
        <div className="text-center">
             <p className="text-center text-lg text-red-500">Patient with ID {patientId} not found.</p>
             <button onClick={onScanAnother} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">
                Scan Another Patient
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Patient Health Record</h2>
                <button 
                    onClick={onScanAnother} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <ArrowPathIcon className="w-5 h-5 mr-2" /> Scan Another
                </button>
            </div>

            {/* Patient Details Section */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><UserIcon className="w-6 h-6 mr-2 text-blue-500"/>Personal Information</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
                    <p><strong>Patient ID:</strong> {patient.id}</p>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Contact:</strong> {patient.contact}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p className="md:col-span-2"><strong>Address:</strong> {patient.address}</p>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><QrCodeIcon className="w-6 h-6 mr-2 text-teal-500"/>Patient QR Code</h3>
                <div className="flex flex-col items-center">
                    <div ref={qrRef} className="flex justify-center mb-4 p-4 border rounded-lg bg-white">
                        <QRCode value={patient.id} size={200} level="H" />
                    </div>
                    <button 
                        onClick={downloadQRCode} 
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                    >
                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Download QR Code
                    </button>
                    <p className="text-sm text-gray-500 mt-3 text-center">Patients can use this QR code for quick login access.</p>
                </div>
            </div>

            {/* Medical Records Section */}
            <div>
                 <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2 text-blue-500"/>Uploaded Documents</h3>
                 <div className="space-y-3">
                    {patient.medicalRecords.length > 0 ? (
                        patient.medicalRecords.map((record, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                                <div>
                                    <p className="font-semibold">{record.name}</p>
                                    <p className="text-sm text-gray-500">Type: {record.type}</p>
                                    <p className="text-sm text-gray-500">
                                        Uploaded by <span className="font-medium capitalize">{record.author}</span> on {new Date(record.uploadedAt).toLocaleString()}
                                    </p>
                                </div>
                                <a href={record.data} download={record.name} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">
                                    Download
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No medical records available for this patient.</p>
                    )}
                </div>
            </div>
            
            <div className="text-center mt-8">
                {!showUpload ? (
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center mx-auto"
                    >
                        <PlusCircleIcon className="w-6 h-6 mr-2" /> Add New Record
                    </button>
                ) : (
                     <form onSubmit={handleUploadSubmit} className="bg-blue-50 p-4 rounded-lg mt-6 border-2 border-dashed border-blue-200 max-w-lg mx-auto">
                        <h4 className="font-semibold text-lg mb-2">Upload New Document</h4>
                        <input 
                            type="file" 
                            onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} 
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            required
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                             <button type="button" onClick={() => setShowUpload(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                Cancel
                            </button>
                            <button type="submit" disabled={uploading || !fileToUpload} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300">
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PatientProfileView;