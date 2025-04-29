"use client";
import { PageData } from "@/interfaces/PageData";
import "./style.css";
import { Request } from "@/types/db";
import { useEffect, useState } from "react";
import { fetchDistance } from "@/fetches/fetchDistance";
import { runQuery } from "@/db/query";
import Coordinates from "@/interfaces/Coordinates";
import { fetchRoute } from "@/fetches/fetchRoute";

interface RequestCardProps{
    req: Request;
    data: PageData;
    setData: React.Dispatch<React.SetStateAction<PageData>>;
}

const RequestCard = (
    {req, data, setData}:RequestCardProps
) => {

    const [loaded, setLoaded] = useState(false);
    const [phone, setPhone] = useState<string>("");
    const [dist, setDist] = useState<any>(null);

    const fetchAllData = async () => {
        await fetchPhone();
        await calcDistance();
        setLoaded(true);
    }

    const fetchPhone = async () => {
        const response = await fetch(`/api/users/getPhone`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({id: req.userId})
        });

        const result = await response.json();

        setPhone(result[0].phone);
    }
    const calcDistance = async () => {

        const endPoint : Coordinates = {lat: req.StartLat, lng: req.StartLng};
        let points = [data.startCoordinates, endPoint];
        
        const response = await fetchDistance(points as Coordinates[]);
        setDist(response);
    }
    const showRoute = async () => {
        const targetLocation : Coordinates = {lat: req.StartLat, lng: req.StartLng};
        const targetEnd : Coordinates = {lat: req.EndLat, lng: req.EndLng};
        const route = await fetchRoute([data.startCoordinates as Coordinates, targetLocation, targetEnd], setData);
        setData((prev) => ({
            ...prev,
            additionalPoints: [],
            targetDestination: targetLocation,
            endCoordinates: targetEnd,
            route: route
        }));
    }
    const takeThis = async () => {
        const response = await fetch(`/api/requests/take`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({driverId: localStorage.getItem("user_id"), requestId: req.id}),
        })
        const result = await response.json();

        if(!result.success){
            alert("Помилка взяття замовлення, оновіть сторінку");
        }

        setData((prev) => ({
            ...prev,
            currentRequest: req
        }));
        localStorage.setItem("current_req", JSON.stringify(req));
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    if(!loaded)
        return(
            <div className="req-card"><label>Loading...</label></div>
        )

    return (
        <div className="req-card">
            
            <label>Тел.: {phone}</label>
            <label>Ціна: {req.price} грн</label>
            <label>Від вас: {(dist.distance / 1000).toFixed(2)} км</label>

            <div className="btns">
                <button onClick={showRoute}>Показати маршрут</button>

                <button onClick={takeThis}>Прийняти</button>
            </div>

        </div>
    )
}
export default RequestCard;