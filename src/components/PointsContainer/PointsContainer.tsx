import Coordinates from "@/interfaces/Coordinates";
import { PageData } from "@/interfaces/PageData";
import { useState } from "react";
import "./style.css";

interface PointsContainerProps{
    points: Coordinates[];
    setData: React.Dispatch<React.SetStateAction<PageData>>;
}

const PointsContainer = (
    {points, setData} : PointsContainerProps
) => {
    const [panelVisible, setPanelVisible] = useState(false);

    const clearAdditionalPoints = () => {
        setData((prev) => ({
            ...prev,
            additionalPoints: []
        }));
    }

    if(!panelVisible){
        return (
            <div className="points-container">
                <i 
                    className='bx bx-chevrons-right'
                    onClick={(e) => setPanelVisible(true)}
                />
                
            </div>
        )
    }

    return (
        <div className="points-container">
            <div className="header">
                <h3>Додаткові точки</h3>
                <i 
                    className='bx bx-trash-alt'
                    onClick={clearAdditionalPoints}
                />
                <i 
                    className='bx bx-chevrons-left' 
                    onClick={(e) => setPanelVisible(false)}
                />
            </div>
            
            <div className="items">
                {points.map((point, i) => (
                    <div className="item" key={i}>
                        <p>{point.lat.toFixed(2)} / {point.lng.toFixed(2)}</p>
                        <button
                            onClick={(e) => {
                                setData((prev) => ({...prev, additionalPoints: prev.additionalPoints.filter((_, index) => index != i)}));
                            }}
                        >X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PointsContainer;