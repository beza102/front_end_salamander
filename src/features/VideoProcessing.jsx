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

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
                const data = await response.json();

                if (response.ok) {
                    setJobData(data);
                } else {
                    setError(data.error || "Failed to fetch job.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch job. Check console for details.");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleBack = () => navigate('/preview-processing');

    if (loading) return <p>Loading job results...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="processing-container">
            <Header pageName={`Processing Job: ${jobId}`} />

            <div className="processing-content">
                <h3>Input Video:</h3>
                <p>{jobData.inputPath}</p>

                <h3>Processing Details:</h3>
                <p>Target Color: {jobData.targetColor}</p>
                <p>Threshold: {jobData.threshold}</p>

                <h3>Results:</h3>
                {jobData.outputCsv ? (
                    <a href={jobData.outputCsv} target="_blank" rel="noopener noreferrer">
                        Download CSV Results
                    </a>
                ) : (
                    <p>No results available yet.</p>
                )}

                {jobData.frames && jobData.frames.length > 0 && (
                    <div className="frames-list">
                        <h3>Binarized Frames:</h3>
                        {jobData.frames.map((frame, index) => (
                            <img key={index} src={frame} alt={`Frame ${index}`} className="processed-frame" />
                        ))}
                    </div>
                )}
            </div>

            <button className="back-button" onClick={handleBack}>Back to Preview</button>
            <Footer />
        </div>
    );
}
