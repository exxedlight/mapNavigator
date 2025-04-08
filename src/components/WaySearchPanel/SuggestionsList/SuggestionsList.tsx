"use client";
import "./style.css";

// Список запропонованих варіантів точок на основі введення
const SuggestionsList = ({
    suggestions,
    onSelect,
}: {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
}) => {
    if (suggestions.length === 0) return null;

    return (
        <div className="suggestion-list-container">
            <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => onSelect(suggestion)}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestionsList;