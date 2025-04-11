"use client";
import "./style.css";
import LoginPanel from "../LoginPanel/LoginPanel";
import React from "react";

export interface HeaderProps {
    loggedIn: boolean; 
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (
    {loggedIn, setLoggedIn} : HeaderProps
) => {

    return (
        <header>
            <h1>Навігатор</h1>
            
            <LoginPanel
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
            />
        </header>
    );
}
export default Header;