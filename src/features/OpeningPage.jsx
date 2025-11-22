import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer.jsx';
import '../css/openingPage.css';

const howItWorksText = [
    "1. Upload your video.",
    "2. Set the color tracking threshold.",
    "3. Process the video and view the results.",
];

const initialVideos = [
    'GMT20241017-200208_Recording_1920x1080.mp4',
    'GMT20241017-200208_Recording_1920x1080.mp4',
    'GMT20241017-200208_Recording_1920x1080.mp4',
];

export default function OpeningPage() {
    const navigate = useNavigate();
    
    const [processedVideos, setProcessedVideos] = useState([]); 

    const showProcessedVideos = processedVideos && processedVideos.length > 0;
    
    const mainTitle = showProcessedVideos ? "Salamander Tracker" : "Welcome to Salamander Tracker!";
    const buttonText = showProcessedVideos ? "Process New Video" : "Get Started";

    const handleButtonClick = () => {
        navigate('/select-video'); 
        // For testing the "Processed" view: 
        // setProcessedVideos(initialVideos); 
    };

    return (
        <div className="opening-page-container">
            {/* NEW: Salamander Image Container */}
            <div className="salamander-image-corner"></div>

            <h1 className="main-title">{mainTitle}</h1>

            <main className={`card-container ${showProcessedVideos ? 'two-cards' : 'one-card'}`}>
                
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
                
                <div className="card how-it-works-card">
                    <h2>How this Works</h2>
                    
                    {howItWorksText.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>
            </main>
            
            <div className="buttons">
                <button
                    className="largeButton process-new-video-button"
                    onClick={handleButtonClick}
                >
                    {buttonText}
                </button>
            </div>

            {/* <Footer /> */}
        </div>
    );
}