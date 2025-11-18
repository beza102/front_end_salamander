import salamander from "../assets/salamander_image.png"

export default function Header() {
    return (
        <header className="app-header">
            <img className="salamander_image" src={salamander} alt="Salamander" />
            <h1 className="name">Salamander Tracker</h1>
            <h1 className="pageName">Page Name</h1>
        </header>
    )
}