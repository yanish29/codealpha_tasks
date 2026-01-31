import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="app-wrapper">
            <Navbar />
            <main className="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
