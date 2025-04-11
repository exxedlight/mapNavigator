"use client";
import MapComponentProps from "@/interfaces/MapComponentProps";
import "./style.css";
import { useEffect, useState } from "react";
import RequestCard from "./RequestCard/RequestCard";
import { Request } from "@/types/db";

const DriverRequests = (
    {data, setData}:MapComponentProps
) => {

    const [panelVisible, setPanelVisible] = useState(false);
    const [reqs, setReqs] = useState<Request[]>([]);

    const getAvailableReqs = async () => {
        const response = await fetch(`/api/requests/available`, {
            method: "GET",
            headers: {"content-type": "application/json"},
        });
        const result = await response.json();
        setReqs(result);
    }

    useEffect(() => {
        if(panelVisible){
            getAvailableReqs();
        }
    }, [panelVisible]);

    if(!panelVisible)
        return (
            <i className='d-button open bx bx-list-ul' onClick={_ => setPanelVisible(true)}/>
        );

    return (
        <div className="driver-requests-panel">
            <h2>Замовлення</h2>

            <div className="req-list">
                {reqs.length > 0 && reqs.map((req,i) => (
                    <RequestCard
                    data={data}
                    setData={setData}
                    req={req}
                    key={i}/>
                ))}
                
            </div>

            <i className="d-button close" onClick={_=>setPanelVisible(false)}>X</i>
        </div>
    );
}
export default DriverRequests;