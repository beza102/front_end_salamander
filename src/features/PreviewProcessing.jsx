import { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import ActionButtons from "../components/Buttons";
import "../css/previewProcessing.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- Video Row ----------
function VideoRow({ video, onDelete, onSelect, selectedVideo }) {
  const handleOpenVideo = () => {
    window.open(`${API_BASE_URL}/videos/${video}`, "_blank");
  };

  const isSelected = selectedVideo === video;

  return (
    <div className={`video-row ${isSelected ? "selected" : ""}`}>
      <div className="video-name">
        <span className="video-link" onClick={handleOpenVideo}>
          {video}
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

// ---------- Upload Button ----------
function UploadButton({ onUpload }) {
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("videoFile", file);

    try {
      const response = await fetch(`${API_BASE_URL}/process/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onUpload(data.filename);
        alert(`Uploaded: ${data.filename}`);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Network error uploading file");
    }
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

// ---------- Video List ----------
function VideoList({ videoFiles, onUpload, onDelete, onSelect, selectedVideo }) {
  return (
    <div className="video-list-container">
      <div className="video-list">
        <h3>List of Available Videos ({videoFiles.length})</h3>

        <div className="scroll-list">
          {videoFiles.map((video, index) => (
            <VideoRow
              key={video + index}
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

// ---------- Frame + Preview ----------
function BinarizingImage({ targetColor, threshold, setTargetColor, setThreshold, selectedVideo }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [binarizedUrl, setBinarizedUrl] = useState(null);

  // Load original thumbnail
  useEffect(() => {
    if (!selectedVideo) return;
    setThumbnailUrl(`${API_BASE_URL}/process/thumbnail/${selectedVideo}`);
  }, [selectedVideo]);

  // Load binarized image whenever targetColor, threshold, or selectedVideo changes
  useEffect(() => {
    if (!selectedVideo) return;
    if (!targetColor) return;

    const fetchBinarized = async () => {
      try {
        const params = new URLSearchParams({
          filename: selectedVideo,
          color: targetColor.replace("#", ""), // send hex without #
          threshold
        });
        const res = await fetch(`${API_BASE_URL}/process/binarize-preview?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.image) {
          setBinarizedUrl(`data:image/png;base64,${data.image}`);
        }
      } catch (err) {
        console.error("Error fetching binarized preview", err);
        setBinarizedUrl(null);
      }
    };

    fetchBinarized();
  }, [targetColor, threshold, selectedVideo]);

  return (
    <div className="preview-content">
      <div className="preview-frames">
        
        <div className="preview-section">
          <h3>Original Frame</h3>
          <div className="frame-box">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt="thumbnail" width="300" />
            ) : (
              <p>Original frame will appear here</p>
            )}
          </div>
        </div>

        <div className="preview-section">
          <h3>Binarized Preview</h3>
          <div className="frame-box">
            {binarizedUrl ? (
              <img src={binarizedUrl} alt="binarized preview" width="300" />
            ) : (
              <p>Adjust target color and threshold to generate preview</p>
            )}
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

// ---------- MAIN PAGE ----------
export default function PreviewProcessing() {
  const navigate = useNavigate();

  const [threshold, setThreshold] = useState(50);
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);

  useEffect(() => {
    const fetchVideoList = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/process/list`);
        const data = await res.json();
        if (res.ok) setVideoFiles(data);
      } catch {}
    };
    fetchVideoList();
  }, []);

  const handleUpload = (filename) => {
    setVideoFiles((prev) => [...prev, filename]);
    setSelectedVideo(filename);
  };

  const handleDelete = (video) => {
    setSelectedVideo(null);
    setVideoFiles((prev) => prev.filter((v) => v !== video));
  };

  const handleProcessVideo = () => {
    if (!selectedVideo) {
      alert("Select a video first");
      return;
    }
    navigate(`/processing/12345`);
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

      <ActionButtons onNext={handleProcessVideo} nextText="Process Video" />
      <Footer />
    </div>
  );
}
