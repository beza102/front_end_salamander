import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx';
import "../css/videoProcessing.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VideoProcessing() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Polling interval (ms)
    const POLLING_INTERVAL = 3000;

    useEffect(() => {
        let intervalId;

        const fetchJob = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
                const data = await response.json();

                if (response.ok) {
                    setJobData(data);
                    setError(null);

                    // Stop polling if job is finished
                    if (data.status === 'completed' || data.status === 'failed') {
                        clearInterval(intervalId);
                    }
                } else {
                    setError(data.error || 'Job not found');
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error('Polling failed:', err);
                setError('Failed to communicate with server. Check console.');
                clearInterval(intervalId);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchJob();

        // Start polling
        intervalId = setInterval(fetchJob, POLLING_INTERVAL);

        return () => {
            console.log(`Stopping job polling for ${jobId}`);
            clearInterval(intervalId);
        };
    }, [jobId]);

    const handleBack = () => navigate('/preview-processing');

    if (loading) return <p>Loading job status...</p>;
    if (error) return <p className="error">Error: **{error}**</p>;
    if (!jobData || !jobData.status) return <p>Job data is incomplete or corrupted.</p>;

    const isProcessing = jobData.status === 'submitted' || jobData.status === 'processing';
    const isCompleted = jobData.status === 'completed';
    const isFailed = jobData.status === 'failed';

    return (
        <div className="processing-container">
            <Header pageName="Processing Video" />

            <div className="processing-title-box">
                <h2>Overview of Job: {jobId}</h2>
            </div>

            <div className="processing-status-box">
                <p><strong>Status:</strong> {jobData.status}</p>

        {isProcessing && (
            <>
                <p><strong>Status:</strong> {jobData.status}</p>
                <p>Processing... this page is auto-refreshing every few seconds.</p>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${jobData.progress || 5}%` }}
                    />
                </div>

                <p className="progress-label">{jobData.progress || 5}% Complete</p>
            </>
        )}

                {isCompleted && (
                    <>
                        <p>Done!</p>
                        <p><strong>Result:</strong></p>
                        
                        <a
                            href={`${API_BASE_URL}/process/${jobId}/result`}
                            download
                        >
                            Download Result CSV
                        </a>
                    </>
                )}

                {isFailed && (
                    <p className="error-message">The job failed: {jobData.errorDetails || ""}</p>
                )}
            </div>

            <div className="processing-buttons">
                <button onClick={() => navigate("/preview-processing")}>Select New Video</button>
                <button onClick={() => navigate("/")}>Go to Main</button>
            </div>

            <Footer />
        </div>
    );
}