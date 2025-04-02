import React, { useState } from "react";
import WaySearchComponentProps from "../interfaces/WaySearchComponentProps";
import SuggestionsList from "./SuggestionsList";
import { fetchSuggestions } from "../fetches/fetchSuggestion";
import { fetchCoordinates } from "../fetches/fetchCoordinates";



const WaySearchPanel: React.FC<WaySearchComponentProps> = ({
    setError,
    setStartCoordinates,
    setEndCoordinates,
    isDeviceGeoUsed
}) => {

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
        setError(null);

        if ((!startAddress && !isDeviceGeoUsed) || !endAddress) {
            setError('Заповніть всі поля.');
            return;
        }

        if(!isDeviceGeoUsed) await fetchCoordinates(startAddress, setStartCoordinates, setError);
        await fetchCoordinates(endAddress, setEndCoordinates, setError);
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
        setError(null);
    };

    const handleEndAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndAddress(e.target.value);
        handleInputChange(e, setEndAddress, setEndSuggestions);
        setError(null);
    };

    return (
        <form onSubmit={handleSubmit} className='route-form'>

            <a className='close-btn' onClick={handleVisibilityChanged}>{formBtnSymbol}</a>

            {isFormShown && (
                <>

                    {!isDeviceGeoUsed && (
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