import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer.jsx'; 

export default function VideoSelection() {
    const navigate = useNavigate();

    const handleGoBack = () => {
    navigate(-1);
  };

    const handleVideoProcessing = () => {
        navigate('/preview');
    };

    return (
        <>
            <Header />

            <div className="buttons">
                <button 
                    className="smallButtons"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
                <button 
                    className="smallButtons"
                    onClick={handleVideoProcessing}
                >
                    Video Processing
                </button>
            </div>

            

            <Footer />
        </>
    )
}