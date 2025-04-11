"use client";
import { useEffect, useState } from "react";
import "./style.css";
import MessageComponent from "../MessageComponent/MessageConponent";
import { HeaderProps } from "../Header/Header";

const LoginPanel = (
    {loggedIn, setLoggedIn}:HeaderProps
) => {

    const [panelVisible, setPanelVisible] = useState(false);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [mess, setMess] = useState("");

    useEffect(() => {
        if(
            localStorage.getItem("user_id") && 
            localStorage.getItem("user_role") && 
            localStorage.getItem("user_login")
        ){
            setLoggedIn(true);
        }
        else{
            localStorage.removeItem("user_id"); 
            localStorage.removeItem("user_role"); 
            localStorage.removeItem("user_login");
        }
    }, []);

    const handleLogin = async () => {
        setMess("");

        if(login.length < 1 || password.length < 1){
            setMess("Заповніть логін на пароль");
            return;
        }

        const resp = await fetch(`/api/login`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({login, password}),
        });

        const result = await resp.json();
        if(!result.success){
            setMess("Перевірте правильність даних");
            return;
        }

        await localStorage.setItem("user_id", result.userId);
        await localStorage.setItem("user_login", result.userLogin);
        await localStorage.setItem("user_role", result.role);
        await setMess("Успіх");

        window.location.reload();
    }
    const handleRegister = async () => {
        setMess("");

        if(login.length < 1 || password.length < 1 || phone.length < 1){
            setMess("Заповніть логін, пароль, номер тел.")
            return;
        }

        const resp = await fetch(`/api/register`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({login, password, phone}),
        });
        const result = await resp.json();

        if(!result.success){
            setMess(result.message);
            return;
        }
        else{
            setMess("Реєстрація успішна");
        }

    }
    const logOut = () => {
        localStorage.removeItem("user_id"); 
        localStorage.removeItem("user_role"); 
        localStorage.removeItem("user_login");
        setLoggedIn(false);
    }

    if(!panelVisible)
        return(
            <i 
                className={`bx bx-log-${!loggedIn ? "in" : "out"}-circle`} 
                onClick={_ => !loggedIn ? setPanelVisible(true) : logOut()}
            />
        );

    return (
        <div className="login-panel">

            <MessageComponent
            text={mess}/>

            <input type="text"      placeholder="Логін" 
                value={login}       onChange={(e) => setLogin(e.target.value)}/>
            <input type="password"  placeholder="Пароль" 
                value={password}    onChange={(e) => setPassword(e.target.value)}/>
            
            <input type="text"      placeholder="Номер тел. (для реєстрації)" 
                value={phone}       onChange={(e) => setPhone(e.target.value)}/>

            <div className="buttons">
                <button onClick={handleLogin}>Увійти</button>
                <button onClick={handleRegister}>Реєстрація</button>
            </div>

            <i id="close" onClick={_ => setPanelVisible(false)}>X</i>
        </div>
    );
}
export default LoginPanel;