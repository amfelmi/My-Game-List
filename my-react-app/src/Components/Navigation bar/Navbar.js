import axios from "axios";
import logo from "./logo-no-background.png"
import "./Navbar.css"
import { useEffect, useState } from "react";

export default function Navbar() {
    const [auth, setAuth] = useState(false)
    const [name, setName] = useState('')

    //Getting the username
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:3001/get-username', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.username);
                } else {
                    setAuth(false);
                }
            });
    }, []);

    const handleSignOut = () => {
        axios.get('http://localhost:3001/signout')
            .then(res => {
                if (res.data.Status === "Success") {
                    setTimeout(() => {
                        global.location.reload(true);
                    }, 500);
                } else {
                    alert("Signout error");
                }
            }).catch(err => console.log(err))
    }

    return (
        <header>
            <nav className="nav-wrapper">
                <ul className="nav-items">
                    <li><a className="nav-item" href="/home">HOME</a></li>
                    <li><a className="nav-item" href="/Browse">BROWSE</a></li>
                    <li><a className="nav-item" href="/recommender">RECOMMENDER</a></li>
                </ul>
                <a href="/home" className="icon-wrapper">
                    <img src={logo} className="nav-logo" />
                </a>

                <ul className="nav-items">
                    {auth ?
                        <>
                            <li><a className="nav-item" href="/mylist">{name}'s LIST</a></li>
                            <li><a className="sign-out nav-item" onClick={handleSignOut}>SIGN OUT</a></li>
                        </>
                        :
                        <>
                            <li><a className="nav-item" href="/sign-up">SIGN UP</a></li>
                            <li><a className="nav-item" href="/sign-in">SIGN IN</a></li>
                        </>
                    }
                </ul>
            </nav>
        </header>
    )
}