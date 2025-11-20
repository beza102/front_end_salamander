import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';

export default function PreviewProcessing() {
    const navigate = useNavigate();

    // This is temporary, will fix this part later
    const [threshold, setThreshold] = useState(50);
    const [targetColor, setTargetColor] = useState("#ff0000");

    return (
        <div className="preview-container">

            {/* Header */}
            <Header pageName="Preview & Processing" />

            {/* Main layout */}
            <div className="preview-content">

                {/* Left frame — Original Frame */}
                <div className="preview-section">
                    <h2>Original Frame</h2>
                    <div className="frame-box">
                        <p>Original frame will appear here</p>
                    </div>
                </div>

                {/* Right frame— Binarized Frame */}
                <div className="preview-section">
                    <h2>Binarized Frame</h2>
                    <div className="frame-box">
                        <p>Binarized image will appear here</p>
                    </div>
                </div>

            </div>

            {/* Controls */}
            <div className="controls">
                
                {/* Target Color */}
                <div className="control-group">
                    <label>Target Color</label>
                    <input
                        type="color"
                        value={targetColor}
                        onChange={(e) => setTargetColor(e.target.value)}
                    />
                </div>

                {/* Threshold Slider */}
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