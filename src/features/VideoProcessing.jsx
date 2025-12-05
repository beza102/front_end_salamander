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

    const POLLING_INTERVAL = 3000; // 3 seconds

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

        fetchJob(); // initial fetch
        intervalId = setInterval(fetchJob, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [jobId]);

    const handleBack = () => navigate('/preview-processing');

    if (loading) return <p>Loading job status...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!jobData) return <p>Job data is unavailable. Try refreshing.</p>;

    // Use fallback values if progress/status are temporarily missing
    const status = jobData.status || 'submitted';
    const progress = typeof jobData.progress === 'number' ? jobData.progress : 0;
    const resultCsv = jobData.resultCsv || null;

    const isProcessing = status === 'submitted' || status === 'processing';
    const isCompleted = status === 'completed';
    const isFailed = status === 'failed';

    return (
        <div className="processing-container">
            <Header pageName="Processing Video" />

            <div className="processing-title-box">
                <h2>Overview of Job: {jobId}</h2>
            </div>

            <div className="processing-status-box">
                <p><strong>Status:</strong> {status}</p>

                {isProcessing && (
                    <>
                        <p>Processing... this page auto-refreshes every few seconds.</p>

                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="progress-label">{progress}% Complete</p>
                    </>
                )}

                {isCompleted && resultCsv && (
                    <>
                        <p>Done!</p>
                        <p><strong>Result:</strong></p>
                        <a href={`${API_BASE_URL}${resultCsv}`} download>
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
