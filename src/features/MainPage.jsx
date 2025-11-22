import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx'; 

export default function OpeningPage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/preview-processing');
    };

    return (
        <div className="main-page-container">
            
            <main className="welcome-content">
                <h1>Welcome to Salamander Tracker!</h1>
                
                <div className="how-it-works-box">
                    <h2>How this Works</h2>
                    
                    <p>1. Upload your video.</p>
                    <p>2. Set the color tracking threshold.</p>
                    <p>3. Process the video and view the results.</p>
                </div>
                
                <div className="buttons">
                    <button 
                        className="pinkButton"
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </button>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}