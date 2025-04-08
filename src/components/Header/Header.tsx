"use client";
import { useState } from "react";
import "./style.css";

const Header = () => {

    const [isLoggedIn, setLoggedIn] = useState(false);

    return (
        <header>
            <h1>Навігатор</h1>
            <i className={`bx bx-log-${!isLoggedIn ? "in" : "out"}-circle`} />

        </header>
    );
}
export default Header;