import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../../Components/Navigation bar/Navbar";
import Searchbar from "../../../Components/Search bar/Searchbar";
import validation from "./LoginValidation";
import "./SignIn.css"
import axios from 'axios';
import { useUser } from "../../../UserProvider";

export default function SignIn() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    }

    const { setUser } = useUser();

    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
        console.log("Signing in")
        axios
            .post("http://localhost:3001/users_login", values)
            .then((res) => {
                console.log(res.data);

                if (res.data === "Success") {
                    setUser({ email: values.email });
                    navigate("/home"); /* Where the landing page is after signing up */
                } else {
                    setErrors("Invalid Email or Password");
                }
            })
            .catch((err) => {
                console.error("Error during login:", err);
                setErrors("an error occurred during login.")
            })
    };


    return (
        <div className="page">
            <Navbar />
            <Searchbar />
            <section className="login-wrapper">
                <form className="login-form" action="" onSubmit={handleSubmit}>

                    <h1 className="title">Login</h1>

                    <div className="input-wrapper">
                        <label htmlFor="email"></label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input-box"
                            onChange={handleInput} />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="password"></label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input-box"
                            onChange={handleInput}
                            autoComplete="off"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>

                    <div className="button-wrapper">
                        <button type="submit" className="submit-btn">Log In</button>
                    </div>

                    <div className="link-wrapper">
                        <p>Don't have an account?</p>
                        <a href="/sign-up">Sign up</a>
                    </div>
                </form>
            </section>
        </div>
    )
}

