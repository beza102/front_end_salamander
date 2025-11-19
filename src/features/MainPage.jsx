import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function MainPage() {
    return (
        <div>
            {/* Use the Header with a specific title */}
            <Header pageName="Main Page" /> 
            
            <h1 style={{ padding: '20px' }}>Main Dashboard Content Here</h1>
            
            <Footer />
        </div>
    );
}