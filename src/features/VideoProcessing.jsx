import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 

export default function VideoProcessing(){
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleProcessVideo = () => {
        navigate('/');
    };

    return(
        <div>
            <Header pageName="Processing Video" />
            <h1>Video Processing page</h1>
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
                        Return to Main
                    </button>
                </div>
                <Footer />
        </div>
    )
}