import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 
import ActionButtons from '../components/Buttons';
import '../css/previewProcessing.css';

// ---------------- Video Row ----------------
function VideoRow({ video, onDelete }) {
    const handleOpenVideo = () => {
        if (video instanceof File) {
            const url = URL.createObjectURL(video);
            window.open(url, "_blank");
        } else {
            alert(`Would open video: ${video}`);
        }
    };

    return (
    <div className="video-row">
        <div className="video-name">
            <span className="video-link" onClick={handleOpenVideo}>
                {video.name || video}
            </span>
        </div>
        <button className="small-buttons" onClick={() => onSelect(video)}>
            Select
        </button>
        <button className="small-buttons" onClick={() => onDelete(video)}>
            Delete
        </button>
    </div>
);
}

// ---------------- Upload Button ----------------
function UploadButton({ onUpload }) {
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="upload-video">
            <input
                type="file"
                accept="video/*"
                id="upload-video-input"
                style={{ display: "none" }}
                onChange={handleFileSelect}
            />
            <button onClick={() => document.getElementById("upload-video-input").click()}>
                Upload Video
            </button>
        </div>
    );
}

// ---------------- Video List ----------------
function VideoList({ videoFiles, onUpload, onDelete }) {
    return (
        <div className="video-list-container">
            <div className="video-list">
                <h3>List of Available Videos</h3>
                <div className="scroll-list">
                    {videoFiles.map((video, index) => (
                        <VideoRow key={index} video={video} onDelete={onDelete} />
                    ))}
                </div>
                <UploadButton onUpload={onUpload} />
            </div>
        </div>
    );
}

// ---------------- Binarizing Image ----------------
function BinarizingImage({ targetColor, threshold, setTargetColor, setThreshold }) {
    return (
        <div className="preview-content">
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
    );
}

// ---------------- Main Page ----------------
export default function PreviewProcessing() {
    const navigate = useNavigate();

    const [threshold, setThreshold] = useState(50);
    const [targetColor, setTargetColor] = useState("#ff0000");

    const [videoFiles, setVideoFiles] = useState([
        "Example exmple 04_04_25 (1).mov",
        "Fake example 04_04_25.MP4",
        "Salamander_salamander 04_04_25.mov",
        "GMT20241017-200208_Recording_1920×1080.mp4",
        "Another Example 04_04_25.mov",
        "Salamander video example.mp4",
    ]);

    const handleProcessVideo = () => navigate('/processing/:jobId');

    const handleUpload = (file) => setVideoFiles(prev => [...prev, file]);

    const handleDelete = (video) => setVideoFiles(prev => prev.filter(v => v !== video));

    return (
        <div className="preview-container">
            <Header pageName="Preview Processing" />

            <div className="main-content">
                <VideoList 
                    videoFiles={videoFiles}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                />
                <BinarizingImage 
                    threshold={threshold}
                    setThreshold={setThreshold}
                    targetColor={targetColor}
                    setTargetColor={setTargetColor}
                />
            </div>

            <ActionButtons 
                onNext={handleProcessVideo}
                nextText="Process Video"
            />

            <Footer />
        </div>
    );
}
