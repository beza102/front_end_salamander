import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx'; 
import ActionButtons from '../components/Buttons';

export default function VideoProcessing(){
    const navigate = useNavigate();

    const handleMain = () => {
        navigate('/');
    };

    return(
        <div>
            <Header pageName="Processing Video" />
            <h1>Video Processing page</h1>
            <ActionButtons 
                onNext={handleMain}
                nextText="Return to Main"
            />
                <Footer />
        </div>
    )
}