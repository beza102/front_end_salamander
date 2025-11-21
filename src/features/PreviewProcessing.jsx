import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 
import '../css/previewProcessing.css';

function VideoList({ videoFiles, onPreview, onSelect }) {
    return (
        <div className="video-list-container">
            <div className="video-list">
                <h3>List of Available Videos</h3>
                {videoFiles.map((video, index) => (
                    <div className="video-row" key={index}>
                        <div className="video-name">{video}</div>
                        <button 
                            className="small-buttons" 
                            onClick={() => onPreview(video)}
                        >
                            Preview
                        </button>
                        <button 
                            className="small-buttons" 
                            onClick={() => onSelect(video)}
                        >
                            Select
                        </button>
                    </div>
                ))}
                <div className="upload-video">
                    <button>
                        Upload Video
                    </button>
                </div>
            </div>
        </div>
    );
}

function BinarizingImage({targetColor, threshold, setTargetColor, setThreshold}) {
    return (
        <div className='preview-content'>
            {/* Main layout: Original + Binarized */}
            <div className="preview-frames">

                <div className="preview-section">
                    <h3>Original Frame</h3>
                    <div className="frame-box">
                        <p>Original frame will appear here</p>
                    </div>
                </div>

                <div className="preview-section">
                    <h3>Binarized Frame</h3>
                    <div className="frame-box">
                        <p>Binarized image will appear here</p>
                    </div>
                </div>

            </div>

            {/* Controls */}
            <div className="controls">

                <div className="control-group">
                    <label>Target Color</label>
                    <input
                        type="color"
                        value={targetColor}
                        onChange={(e) => setTargetColor(e.target.value)}
                    />
                </div>

                <div className="control-group">
                    <label>Threshold: {threshold}</label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default function PreviewProcessing() {
    const navigate = useNavigate();

    // Temporary values
    const [threshold, setThreshold] = useState(50);
    const [targetColor, setTargetColor] = useState("#ff0000");

    const videoFiles = [
        "Ensatina eschscholtzii 04_04_25 (1).mov",
        "Ensatina eschscholtzii 04_04_25.MP4",
        "Ensatina eschscholtzii 04_04_25.mov",
        "GMT20241017-200208_Recording_1920×1080.mp4",
        "Ensatina eschscholtzii 04_04_25 (1).mov",
        // "Ensatina eschscholtzii 04_04_25.MP4"
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePreview = (video) => {
        console.log("Previewing:", video);
        // You can add loading of frames here later
    };

    return (
        <div className="preview-container">

            <Header pageName="Preview & Processing" />

            <div className="main-content">
                {/* Video list */}
                <VideoList 
                    videoFiles={videoFiles}
                    onPreview={handlePreview}
                />

                {/* Binarizing image */}
                <BinarizingImage 
                    threshold={threshold}
                    setThreshold={setThreshold}
                    targetColor={targetColor}
                    setTargetColor={setTargetColor}
                />
            </div>

            {/* Buttons */}
            <div className="buttons">
                <button 
                    className="smallButtons"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
            </div>

            <Footer />
        </div>
    );
}
