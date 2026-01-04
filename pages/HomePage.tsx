import React from 'react';
import { Page } from '../types';
import { ShieldCheckIcon, QrCodeIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center items-center mb-4 text-teal-500">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    return (
        <div className="text-center">
            {/* Hero Section */}
            <section className="bg-light-blue-100 rounded-lg shadow-inner py-16 md:py-24 px-4 bg-blue-50 mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Simplifying Healthcare Access
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    with <span className="text-teal-500 font-semibold">Secure QR Technology</span>. Your health records, instantly available when you need them most.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => setCurrentPage('REGISTER')}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => setCurrentPage('LOGIN')}
                        className="bg-white border-2 border-teal-500 text-teal-500 hover:bg-teal-50 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
                    >
                        Login
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<UserPlusIcon className="h-16 w-16"/>}
                        title="Register Patient"
                        description="Quickly create a secure digital profile and upload essential medical documents."
                    />
                    <FeatureCard
                        icon={<QrCodeIcon className="h-16 w-16"/>}
                        title="Generate QR"
                        description="Receive a unique, personal QR code that links directly to your health records."
                    />
                    <FeatureCard
                        icon={<ShieldCheckIcon className="h-16 w-16"/>}
                        title="Secure Data Access"
                        description="Authorized medical staff can instantly access your records with a simple scan."
                    />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
