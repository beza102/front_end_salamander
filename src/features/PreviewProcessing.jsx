import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 
import ActionButtons from '../components/Buttons';
import '../css/previewProcessing.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------- Video Row (Uses Filename String) ----------------
function VideoRow({ video, onDelete, onSelect, selectedVideo }) {
    // The 'video' prop is now expected to be a filename string.
    const handleOpenVideo = () => {
        // Use the filename to access the video via the static route
        window.open(`${API_BASE_URL}/videos/${video}`, "_blank");
    };

    const isSelected = selectedVideo === video;

    return (
        <div className={`video-row ${isSelected ? "selected" : ""}`}>
            <div className="video-name">
                <span className="video-link" onClick={handleOpenVideo}>
                    {video} {/* Display the filename */}
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

// ---------------- Upload Button (Now handles API upload) ----------------
function UploadButton({ onUpload }) {
    const handleFileSelect = async (event) => { // 💡 Made async
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('videoFile', file); // 'videoFile' must match the Multer field name in backend

        try {
            // 💡 NEW: API call to upload the file
            const response = await fetch(`${API_BASE_URL}/process/upload`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Use the filename returned by the server to update the list
                onUpload(data.filename); 
                alert(`File ${data.filename} uploaded successfully!`);
            } else {
                alert(`Upload failed: ${data.error || "Unknown error."}`);
            }

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Network error during file upload.");
        }
        
        // Reset the input so the same file can be selected again
        event.target.value = null; 
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

// ---------------- Video List (Unchanged structure) ----------------
function VideoList({ videoFiles, onUpload, onDelete, onSelect, selectedVideo }) {
    return (
        <div className="video-list-container">
            <div className="video-list">
                <h3>List of Available Videos ({videoFiles.length})</h3>
                <div className="scroll-list">
                    {videoFiles.map((video, index) => (
                        <VideoRow
                            key={video + index} // Use filename + index for a better key
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


// ---------------- Binarizing Image (Uses Filename String) ----------------
function BinarizingImage({ targetColor, threshold, setTargetColor, setThreshold, selectedVideo }) {
    const [originalUrl, setOriginalUrl] = useState(null);

    useEffect(() => {
        if (!selectedVideo) return;
        // The selectedVideo is now always a string (filename)
        setOriginalUrl(`${API_BASE_URL}/videos/${selectedVideo}`);
    }, [selectedVideo]);

    return (
        <div className="preview-content">
            <div className="preview-frames">
                <div className="preview-section">
                    <h3>Original Video</h3>
                    <div className="frame-box">
                        {originalUrl 
                            ? <video src={originalUrl} controls width="300" /> 
                            : <p>Select a video to preview here</p>
                        }
                    </div>
                </div>
                
                 <div className="preview-section">
                    <h3>Processing Settings</h3>
                    <div className="frame-box">
                       {selectedVideo ? (
                          // 💡 Display the selected filename string
                          <p>Ready to process **{selectedVideo}** with the settings below.</p>
                       ) : (
                          <p>Select a video and set parameters before processing.</p>
                       )}
                    </div>
                </div>
            </div>

            <div className="controls">
                <div className="control-group">
                    <label>Target Color</label>
                    <input type="color" value={targetColor} onChange={(e) => setTargetColor(e.target.value)} />
                </div>
                <div className="control-group">
                    <label>Threshold: **{threshold}**</label>
                    <input type="range" min="0" max="255" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
                </div>
            </div>
        </div>
    );
}

// ---------------- Main Page (Fetches list and starts job) ----------------
export default function PreviewProcessing() {
    const navigate = useNavigate();
    const [threshold, setThreshold] = useState(50);
    const [targetColor, setTargetColor] = useState("#ff0000");
    const [selectedVideo, setSelectedVideo] = useState(null);

    // 💡 CHANGE: Initialize as an empty array, will be populated by useEffect
    const [videoFiles, setVideoFiles] = useState([]); 

    // 💡 NEW: Fetch the list of videos from the backend on load
    useEffect(() => {
        const fetchVideoList = async () => {
            try {
                // Fetch the list from the new backend endpoint /process/list
                const response = await fetch(`${API_BASE_URL}/process/list`); 
                const data = await response.json();

                if (response.ok) {
                    setVideoFiles(data);
                } else {
                    console.error("Failed to load videos:", data.error);
                    alert("Error fetching videos from server: " + data.error);
                }
            } catch (error) {
                console.error("Network error fetching video list:", error);
                alert("Cannot connect to server to fetch video list.");
            }
        };

        fetchVideoList();
    }, []); 
    
    // 💡 UPDATED: handleUpload now expects the filename string returned by the API
    const handleUpload = (filename) => {
        setVideoFiles(prev => [...prev, filename]);
        // Immediately select the newly uploaded file for processing
        setSelectedVideo(filename); 
    }; 
    
    const handleDelete = (video) => {
        // NOTE: This only removes it from the list, not the server.
        setSelectedVideo(null); // Deselect if deleted
        setVideoFiles(prev => prev.filter(v => v !== video))
    };


    const handleProcessVideo = async () => {
        if (!selectedVideo) {
            alert("Please select a video first!");
            return;
        }

        // The inputPath is now guaranteed to be the filename string (selectedVideo)
        const inputPath = selectedVideo; 

        try {
            // Call the backend to start the job
            const response = await fetch(`${API_BASE_URL}/process/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputPath: inputPath,
                    targetColor,
                    threshold: Number(threshold) 
                })
            });

            const data = await response.json();

            // Check for the 202 Accepted status from the backend
            if (response.status === 202 && data.jobId) {
                const realJobId = data.jobId;
                // Navigate to the processing status page using the real jobId
                navigate(`/processing/${realJobId}`);
            } else {
                alert(`Error starting job: ${data.error || "Unknown error."}`);
            }
        } catch (err) {
            console.error("Job start failed:", err);
            alert("Failed to connect to the server or start the job.");
        }
    };

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
                    selectedVideo={selectedVideo}
                />
            </div>
            <ActionButtons
                onNext={handleProcessVideo} // Triggers the backend call
                nextText="Process Video"
            />
            <Footer />
        </div>
    );
}