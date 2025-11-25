import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import '../css/mainPage.css';

const howItWorksText = [
    "1. Upload your video.",
    "2. Set the color tracking threshold.",
    "3. Process the video and view the results.",
];

export default function MainPage() {
    const navigate = useNavigate();

    // Will later be updated when user has processed videos
    const [processedVideos, setProcessedVideos] = useState([]);

    const showProcessedVideos = processedVideos && processedVideos.length > 0;
    
    const mainTitle = showProcessedVideos 
        ? "Salamander Tracker" 
        : "Welcome to Salamander Tracker!";
    
    const buttonText = showProcessedVideos 
        ? "Process New Video" 
        : "Get Started";

    const handleButtonClick = () => {
        navigate('/preview-processing');
        // For testing processed screen:
        // setProcessedVideos(["video1.mp4", "video2.mp4"]);
    };

    return (
        <div className="opening-page-container">

            {/* Salamander Image Corner */}
            <div className="salamander-image-corner"></div>

            <h1 className="main-title">{mainTitle}</h1>

            <main className={`card-container ${showProcessedVideos ? 'two-cards' : 'one-card'}`}>

                {/* LEFT CARD: Processed Videos */}
                {showProcessedVideos && (
                    <div className="card processed-videos-card">
                        <h2>Processed Videos</h2>
                        <ul>
                            {processedVideos.map((video, index) => (
                                <li key={index}>{video}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* RIGHT CARD: How It Works */}
                <div className="card how-it-works-card">
                    <h2>How this Works</h2>
                    {howItWorksText.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>

            </main>

            <div className="buttons">
                <button 
                    className="pinkButton"
                    onClick={handleButtonClick}
                >
                    {buttonText}
                </button>
            </div>

            <Footer />
        </div>
    );
}
