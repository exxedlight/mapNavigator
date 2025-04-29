"use client";
import MapComponentProps from "@/interfaces/MapComponentProps";
import "./style.css";
import { useEffect, useState } from "react";
import Coordinates from "@/interfaces/Coordinates";
import { fetchRoute } from "@/fetches/fetchRoute";

const CurrentRequestPanel = (
    {data, setData} : MapComponentProps
) => {

    const [phone,setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const [carLoaded, setCarLoaded] = useState(false);

    const fetchPhone = async () => {
        const response = await fetch(`/api/users/getPhone`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({id: data.currentRequest!.userId}),
        });

        const result = await response.json();

        setPhone(result[0].phone);
    }
    const buildRoute = async () => {
        const targetLocation : Coordinates = {lat: data.currentRequest!.StartLat, lng: data.currentRequest!.StartLng};
        const targetEnd : Coordinates = {lat: data.currentRequest!.EndLat, lng: data.currentRequest!.EndLng};
        const route = await fetchRoute([data.startCoordinates as Coordinates, targetLocation, targetEnd], setData);
        setData((prev) => ({
            ...prev,
            additionalPoints: [],
            targetDestination: targetLocation,
            endCoordinates: targetEnd,
            route: route
        }));
    }
    const fetchAll = async () => {
        await fetchPhone();
        await buildRoute();
        setLoading(false);
    }

    useEffect(() => {
        if(data && data.currentRequest){
            fetchAll();
        }
    }, []);

    const handleCarLoaded = async () => {
        setData((prev) => ({
            ...prev,
            targetDestination: null,
            additionalPoints: []
        }))
        setCarLoaded(true);
    }
    const handleCarComplete = async () => {
        const response = await fetch(``, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({id: data.currentRequest?.id}),
        });
        setData((prev) => ({
            ...prev,
            currentRequest: null,
            route: null,
            endCoordinates: null,
            additionalPoints: []
        }));
        localStorage.removeItem("current_req");
        window.location.reload();
    }
    const handleCarCancel = async () => {
        const response = await fetch(`/api/requests/cancel`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({id: data.currentRequest?.id}),
        })
        setData((prev) => ({
            ...prev,
            currentRequest: null,
            route: null,
            endCoordinates: null,
            additionalPoints: []
        }));
        localStorage.removeItem("current_req");
    }

    if(!data || !data.currentRequest || loading)
        return (
            <div className="current-req-panel">
            <h2>Loading...</h2>
        </div>
    )

    return (
        <div className="current-req-panel">
            <h2>Поточне замовлення</h2>
            <label>Тел.: {phone}</label>

            <div className="current-req-btns">
            {carLoaded ? (
                <button style={{backgroundColor: "rgba(0,255,0,.3)"}} onClick={handleCarComplete}>Виконано</button>
            ) : (
                <button style={{backgroundColor: "rgba(255, 166, 0, 0.3)"}} onClick={handleCarLoaded}>Завантажено</button>
            )}
            <button style={{backgroundColor: "rgba(255,0,0,.3)"}} onClick={handleCarCancel}>Скасування</button>
            </div>
        </div>
    );
}
export default CurrentRequestPanel;