import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer.jsx'; 

function VideoList({videoFiles, onPreview}) {
    return (
        <div className="videoContainer">
            {videoFiles.map((video, index) => (
                <div className="video-row" key={index}>
                    <div className="video-name">{video}</div>
                    <button 
                        className="preview-button" 
                        onClick={() => onPreview(video)}
                    >
                        Preview
                    </button>
                </div>
            ))}
        </div>
    )
}

export default function VideoSelection() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleVideoProcessing = () => {
        navigate('/preview-processing');
    };

    const videoFiles = [
        "Ensatina eschscholtzii 04_04_25 (1).mov",
        "Ensatina eschscholtzii 04_04_25.MP4",
        "Ensatina eschscholtzii 04_04_25.mov",
        "GMT20241017-200208_Recording_1920×1080.mp4",
        "Ensatina eschscholtzii 04_04_25 (1).mov",
        "Ensatina eschscholtzii 04_04_25.MP4"
    ];

    return (
        <>
            <Header />

            <VideoList
                videoFiles={videoFiles}
            />

            <div className="buttons">
                <button 
                    className="smallButtons"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
                <button 
                    className="smallButtons"
                    onClick={handleVideoProcessing}
                >
                    Video Processing
                </button>
            </div>

            <Footer />
        </>
    )
}