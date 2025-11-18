import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import VideoSelection from './features/VideoSelection.jsx'

export default function App() {
	return (
		<div className="app-root">
			<Header />
			<VideoSelection />
			<Footer />
		</div>
	)
}
