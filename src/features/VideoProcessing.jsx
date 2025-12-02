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
    
    // Polling interval time (e.g., check status every 3 seconds)
    const POLLING_INTERVAL = 3000; 

    useEffect(() => {
        let intervalId;

        const fetchJob = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
                const data = await response.json();

                if (response.ok) {
                    setJobData(data);
                    
                    // If job is finished (completed or failed), stop polling
                    if (data.status === 'completed' || data.status === 'failed') {
                        clearInterval(intervalId);
                    }
                } else {
                    // Stop polling on API errors (e.g., 404 job not found)
                    setError(data.error || "Failed to fetch job.");
                    clearInterval(intervalId); 
                }
            } catch (err) {
                console.error("Polling failed:", err);
                setError("Failed to communicate with server. Check console.");
                clearInterval(intervalId); // Stop on network errors
            } finally {
                setLoading(false);
            }
        };

        // 1. Initial fetch immediately
        fetchJob();
        
        // 2. Start polling
        intervalId = setInterval(fetchJob, POLLING_INTERVAL);

        // 3. Cleanup function: runs when component unmounts or before the effect runs again
        return () => {
             console.log(`Stopping job polling for ${jobId}`);
             clearInterval(intervalId);
        }
    }, [jobId]);

    const handleBack = () => navigate('/preview-processing');

    // --- Conditional Rendering based on Status ---
    if (loading) return <p>Loading job status...</p>;
    if (error) return <p className="error">Error: **{error}**</p>;
    
    // Ensure jobData is not null before accessing properties
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
                            // The backend needs to expose a route for downloading this CSV
                            <a href={`${API_BASE_URL}/results/${jobId}.csv`} target="_blank" rel="noopener noreferrer">
                                Download CSV Results
                            </a>
                        ) : (
                            <p>No results file was generated.</p>
                        )}
                    </>
                )}

                {isFailed && (
                    <p className="error-message">The job failed. Details: **{jobData.errorDetails || "No details provided."}**</p>
                )}
                
                {/* Displaying general job details */}
                <h3>Input Video:</h3>
                <p>{jobData.inputPath}</p>

                <h3>Processing Parameters:</h3>
                <p>Target Color: {jobData.targetColor}</p>
                <p>Threshold: {jobData.threshold}</p>

                {/* Remaining logic for displaying frames/results if available */}
                {/* ... (frames rendering remains the same) */}

            </div>

            <button className="back-button" onClick={handleBack}>Back to Preview</button>
            <Footer />
        </div>
    );
}