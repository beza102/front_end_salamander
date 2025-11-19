import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all page components

import Footer from './components/Footer.jsx';
import OpeningPage from './features/OpeningPage.jsx'; 
import MainPage from './features/MainPage.jsx';
import VideoSelection from './features/VideoSelection.jsx';
import PreviewProcessing from './features/PreviewProcessing.jsx';
import VideoProcessing from './features/VideoProcessing.jsx';

// Base path for project setup
const BASE_PATH = "/front_end_salamander"; 

export default function App() {
    return (
        // Router with the required base path
        <Router basename={BASE_PATH}> 
            <div className="app-root">
                
                
                <Routes>
                    {/* all routes */}
                    <Route path="/" element={<OpeningPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/select-video" element={<VideoSelection />} />
                    <Route path="/preview" element={<PreviewProcessing />} />
                    <Route path="/processing/:jobId" element={<VideoProcessing />} />
                    
                    {/*Fallback for 404 */}
                    <Route path="*" element={<h1>404 Page Not Found</h1>} />
                </Routes>
				<Footer />

            </div>
        </Router>
    );
}