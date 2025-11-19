import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'

export default function PreviewProcessing() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleProcessVideo = () => {
        navigate('/processing/:jobId');
    };

    return (


        <div>
            <Header />

            <h1>Original Frame</h1>
            <h1>Binarized Frame</h1>
            <h2>Target Color</h2>
            <h2>Threshold</h2>

            <div className="buttons">
                <button 
                    className="smallButtons"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
                <button 
                    className="smallButtons"
                    onClick={handleProcessVideo}
                >
                    Process Video
                </button>
            </div>

        </div>


        
    )
}