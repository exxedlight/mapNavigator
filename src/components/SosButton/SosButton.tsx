import { useEffect, useState } from "react";
import "./style.css";
import { PageData } from "@/interfaces/PageData";
import { Statuses } from "@/types/db";
import { priceCoefficient } from "../../../staticData";

interface SosButtonProps{
    userData: PageData;
}

const SosButton = (
    {userData} : SosButtonProps
) => {

    const [called, setCalled] = useState(false);
    const [price, setPrice] = useState(0);
    const [currentCallId, setCurrentCallId] = useState(-1);

    useEffect(() => {
        if(userData.distance){
            const newPrice = parseFloat(((userData.distance / 1000) * priceCoefficient).toFixed(2));
            setPrice(newPrice);
        }
    }, [userData.distance]);

    const handleSos = async () => {
        if(!userData.isDeviceGeoUsed){
            alert("Увімкніть геолокацію");
            return;
        }
        if(!userData.startCoordinates ||
            !userData.distance){
            alert("Для виклику потрібна початкова та кінцева точки маршруту.")
            return;
        }

        if(called){
            {/* SET CANCELED */}

            const response = await fetch(`/api/requests/cancel`, {
                method: "POST",
                headers: {"content-type":"application/json"},
                body: JSON.stringify({id: currentCallId}),
            });
            setCurrentCallId(-1);
        }
        else if(!called){
            {/* CALL EVAC */}

            const response = await fetch(`/api/requests`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({
                    userId: localStorage.getItem("user_id"),
                    startLat: userData.startCoordinates.lat,
                    startLng: userData.startCoordinates.lng,
                    endLat: !userData.endCoordinates ? userData.additionalPoints[userData.additionalPoints.length - 1].lat : userData.endCoordinates.lat,
                    endLng: !userData.endCoordinates ? userData.additionalPoints[userData.additionalPoints.length - 1].lng : userData.endCoordinates.lng,
                    timestamp: new Date().toISOString().replace('T',' ').split('.')[0],
                    status: Statuses.pending,
                    price: price,
                })
            });
            const {id} = await response.json();
            setCurrentCallId(id);
        }

        setCalled(!called);
    }

    return (
        <div 
            className="sos" 
            style={{backgroundColor: called ? "orange" : "white"}}
            onClick={handleSos}
        >
            <i className={`bx bx-phone-outgoing ${called && "bx-tada"}`}/>
            <label className="modal-price">{price} грн.</label>
            
        </div>
    );
}
export default SosButton;