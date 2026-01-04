import React, { useState } from 'react';
import { registerPatient } from '../services/authService';
import { Page, UploadedFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface PatientRegistrationProps {
    setCurrentPage: (page: Page) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ setCurrentPage }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        contact: '',
        email: '',
        password: '',
        address: '',
    });
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const uploadedFiles: UploadedFile[] = await Promise.all(
            files.map(async (file) => {
                const base64Data = await fileToBase64(file);
                return {
                    name: file.name,
                    type: file.type,
                    data: base64Data,
                    uploadedAt: new Date().toISOString(),
                    author: 'patient',
                };
            })
        );

        const patientData = {
            ...formData,
            age: parseInt(formData.age),
        };

        const newPatient = registerPatient(patientData, formData.password, uploadedFiles);

        if (newPatient) {
            alert(`Registration successful! Your Patient ID is ${newPatient.id}. Please login.`);
            setCurrentPage('LOGIN');
        } else {
            setError('Registration failed. The email might already be in use.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Patient Registration</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="age">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="gender">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="contact">Contact Number</label>
                            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="address">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows={3}></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="medical-files">Upload Medical Documents (Optional)</label>
                        <p className="text-sm text-gray-500 mb-2">You can upload reports, prescriptions, lab results, etc. (PDF, JPG, PNG).</p>
                        <input
                            type="file"
                            id="medical-files"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                         {files.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>{files.length} file(s) selected:</p>
                                <ul className="list-disc list-inside ml-4">
                                    {files.map(f => <li key={f.name}>{f.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-teal-300"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <button onClick={() => setCurrentPage('LOGIN')} className="text-teal-500 hover:underline font-semibold">
                            Login here
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;