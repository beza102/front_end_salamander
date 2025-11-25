import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 
import ActionButtons from '../components/Buttons';
import '../css/previewProcessing.css';

// Backend URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------- Video Row ----------------
function VideoRow({ video, onDelete, onSelect, selectedVideo }) {
    const handleOpenVideo = () => {
        if (video instanceof File) {
            const url = URL.createObjectURL(video);
            window.open(url, "_blank");
        } else {
            alert(`Would open video: ${video}`);
        }
    };

    const isSelected = selectedVideo === video;

    return (
        <div className={`video-row ${isSelected ? "selected" : ""}`}>
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
        if (file) onUpload(file);
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
function VideoList({ videoFiles, onUpload, onDelete, onSelect, selectedVideo }) {
    return (
        <div className="video-list-container">
            <div className="video-list">
                <h3>List of Available Videos</h3>
                <div className="scroll-list">
                    {videoFiles.map((video, index) => (
                        <VideoRow
                            key={index}
                            video={video}
                            onDelete={onDelete}
                            onSelect={onSelect}
                            selectedVideo={selectedVideo}
                        />
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

// ---------------- Main Component ----------------
export default function PreviewProcessing() {
    const navigate = useNavigate();

    const [threshold, setThreshold] = useState(50);
    const [targetColor, setTargetColor] = useState("#ff0000");
    const [selectedVideo, setSelectedVideo] = useState(null);

    const [videoFiles, setVideoFiles] = useState([
        "Example exmple 04_04_25 (1).mov",
        "Fake example 04_04_25.MP4",
        "Salamander_salamander 04_04_25.mov",
        "GMT20241017-200208_Recording_1920×1080.mp4",
        "Another Example 04_04_25.mov",
        "Salamander video example.mp4",
    ]);

    // ---------------- Process Video ----------------
    const handleProcessVideo = async () => {
        if (!selectedVideo) {
            alert("Please select a video first!");
            return;
        }

        const inputPath = selectedVideo instanceof File
            ? selectedVideo.name
            : selectedVideo;

        try {
            const response = await fetch(`${API_BASE_URL}/process/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputPath: `${API_BASE_URL}/videos/${inputPath}`,
                    targetColor,
                    threshold
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/processing/${data.jobId}`);
            } else {
                alert("Error starting job: " + data.error);
            }
        } catch (err) {
            console.error("Failed to start job:", err);
            alert("Failed to start job. Check console for details.");
        }
    };

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
                    onSelect={setSelectedVideo}
                    selectedVideo={selectedVideo}
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
