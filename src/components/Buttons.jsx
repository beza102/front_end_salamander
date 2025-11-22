import { useNavigate } from "react-router-dom";

export default function ActionButtons({ onNext, backText = "Go Back", nextText = "Next" }) {
    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);

    return (
        <div className="buttons">
            <button className="pinkButtons" onClick={handleGoBack}>
                {backText}
            </button>

            {onNext && (
                <button className="pinkButtons" onClick={onNext}>
                    {nextText}
                </button>
            )}
        </div>
    );
}
