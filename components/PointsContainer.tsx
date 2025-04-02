import { useState } from "react";
import Coordinates from "../interfaces/Coordinates";

interface PointsContainerProps{
    points: Coordinates[];
    setPoints: React.Dispatch<React.SetStateAction<Coordinates[]>>;
}

const PointsContainer = (
    {points, setPoints} : PointsContainerProps
) => {
    const [panelVisible, setPanelVisible] = useState(false);


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
                    className='bx bx-chevrons-left' 
                    onClick={(e) => setPanelVisible(false)}
                />
            </div>
            
            <div className="items">
                {points.map((point, i) => (
                    <div className="item">
                        <p>{point.lat.toFixed(2)} / {point.lng.toFixed(2)}</p>
                        <button
                            onClick={(e) => {
                                setPoints((prev) => prev.filter((_, index) => index !== i));
                            }}
                        >X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PointsContainer;