
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white text-center p-4 mt-8">
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} MediQR | Secure Digital Health Record System</p>
            </div>
        </footer>
    );
};

export default Footer;
