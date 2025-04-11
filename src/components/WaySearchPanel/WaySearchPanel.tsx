"use client";
import React, { useState } from "react";
import SuggestionsList from "./SuggestionsList/SuggestionsList";
import { PageData } from "@/interfaces/PageData";
import Coordinates from "@/interfaces/Coordinates";
import { fetchCoordinates } from "@/fetches/fetchCoordinates";
import { fetchSuggestions } from "@/fetches/fetchSuggestion";
import "./style.css";

interface WaySearchPanelProps{
    data: PageData;
    setData: React.Dispatch<React.SetStateAction<PageData>>;
}


const WaySearchPanel = (
    {data, setData}: WaySearchPanelProps
) => {

    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');

    const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
    const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
    const [isFormShown, setFormShown] = useState(true);
    const [formBtnSymbol, setFormBtnSymbol] = useState("_");

    const handleVisibilityChanged = () => {
        setFormShown(!isFormShown);
        if (isFormShown) setFormBtnSymbol("+");
        else setFormBtnSymbol("_");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setData((prev) => ({
            ...prev,
            additionalPoints: [],
            error: null
        }));

        if ((!startAddress && !data.isDeviceGeoUsed) || !endAddress) {
            setData((prev) => ({
                ...prev,
                error: 'Заповніть всі поля.'
            }));
            return;
        }

        let startCoods: Coordinates = {lat: 0, lng: 0};
        let endCoords: Coordinates = {lat: 0, lng: 0};

        if(!data.isDeviceGeoUsed) 
            startCoods = await fetchCoordinates(startAddress);
        else
            startCoods = data.startCoordinates as Coordinates;
        endCoords = await fetchCoordinates(endAddress);

        //  DEBUG
        //alert(JSON.stringify(startCoods, null, 2) + '\n' + JSON.stringify(endCoords, null, 2));

        setData((prev) => ({
            ...prev,
            startCoordinates: startCoods,
            endCoordinates: endCoords,
        }))
    };


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setAddress: React.Dispatch<React.SetStateAction<string>>,
        setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const value = e.target.value;
        setAddress(value);
        fetchSuggestions(value, setSuggestions);
    };

    const handleStartAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartAddress(e.target.value);
        handleInputChange(e, setStartAddress, setStartSuggestions);
        
        setData((prev) => ({
            ...prev, error: null
        }))
    };

    const handleEndAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndAddress(e.target.value);
        handleInputChange(e, setEndAddress, setEndSuggestions);
        setData((prev) => ({
            ...prev, error: null
        }))
    };

    return (
        <form onSubmit={handleSubmit} className='route-form'>

            <a className='close-btn' onClick={handleVisibilityChanged}>{formBtnSymbol}</a>

            {isFormShown && (
                <>

                    {!data.isDeviceGeoUsed && (
                        <div className='route-form-row'>
                            <label htmlFor="start">Звідки:</label>
                            <div className='input-suggestion'>
                                <input
                                    type="text"
                                    id="start"
                                    value={startAddress}
                                    onChange={handleStartAddressChange}
                                    placeholder="Введіть адресу"
                                    required
                                    autoComplete="off"
                                />
                                <SuggestionsList
                                    suggestions={startSuggestions}
                                    onSelect={(suggestion) => {
                                        setStartAddress(suggestion);
                                        setStartSuggestions([]);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <div className='route-form-row'>
                        <label htmlFor="end">Куди:</label>

                        <div className='input-suggestion'>
                            <input
                                type="text"
                                id="end"
                                value={endAddress}
                                onChange={handleEndAddressChange}
                                placeholder="Введіть адресу"
                                required
                                autoComplete="off"
                            />
                            <SuggestionsList
                                suggestions={endSuggestions}
                                onSelect={(suggestion) => {
                                    setEndAddress(suggestion);
                                    setEndSuggestions([]);
                                }}
                            />
                        </div>
                    </div>
                    <button type="submit">Показати маршрут</button>
                </>
            )}
        </form>
    );
}

export default WaySearchPanel;