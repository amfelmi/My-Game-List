import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./SignUp.css";
import validation from "./SignUpValidation";
import Navbar from "../../../Components/Navigation bar/Navbar";
import Searchbar from "../../../Components/Search bar/Searchbar";
import axios from 'axios';

export default function SignUp() {

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
        console.log("submitted")
        console.log(errors.username)
        console.log(errors.email)
        console.log(errors.password)
        if (errors.username === "" & errors.email === "" & errors.password === "") {
            console.log("validation worked")
            axios
                .post("http://localhost:3001/users", values)
                .then((res) => {
                    navigate("/sign-in"); /* Where the landing page is after signing up */
                })
                .catch((err) => console.log(err));
        } else {
            console.log("Incorrect format")
        }
    };

    return (
        <div className="page">
            <Navbar />
            <Searchbar />
            <section className="signup-wrapper">
                <form className="signup-form" action="" onSubmit={handleSubmit} autoComplete="off">

                    <h1 className="title">Sign up</h1>

                    <div className="input-wrapper">
                        <label htmlFor="username"></label>
                        <input
                            type="text"
                            placeholder="Username"
                            className="input-box"
                            name="username"
                            onChange={handleInput}
                        />
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="email"></label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input-box"
                            name="email"
                            onChange={handleInput}
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-box"
                            name="password"
                            onChange={handleInput}
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>

                    <div className="button-wrapper">
                        <button type="submit" className="submit-btn">Register</button>
                    </div>

                    <div className="link-wrapper">
                        <p>Already have an account?</p>
                        <a href="/sign-in">Log in</a>
                    </div>
                </form>

            </section>
        </div>
    )
}
