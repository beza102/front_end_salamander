import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx';

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
            <Header pageName={`Processing Job: ${jobId}`} />

            <div className="processing-content">
                <h2>Job Status: **{jobData.status.toUpperCase()}**</h2>

                {isProcessing && (
                    <p>Your video is currently being processed. This page will update automatically.</p>
                )}

                {isCompleted && (
                    <>
                        <p>Processing is **complete**! Find your results below.</p>
                        {jobData.outputCsv ? (
                            <a
                                href={`${API_BASE_URL}/results/${jobId}.csv`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download CSV Results
                            </a>
                        ) : (
                            <p>No results file was generated.</p>
                        )}
                    </>
                )}

                {isFailed && (
                    <p className="error-message">
                        The job failed. Details: **{jobData.errorDetails || 'No details provided.'}**
                    </p>
                )}

                <h3>Input Video:</h3>
                <p>{jobData.inputPath}</p>

                <h3>Processing Parameters:</h3>
                <p>Target Color: {jobData.targetColor}</p>
                <p>Threshold: {jobData.threshold}</p>
            </div>

            <button className="back-button" onClick={handleBack}>
                Back to Preview
            </button>
            <Footer />
        </div>
    );
}
