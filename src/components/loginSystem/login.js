import React, {useReducer, useState } from "react";
import './register.css';
import logo from '../../static/logo.png';
import axios from "axios";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function LoginSystem() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [successAlert, setSuccessAlert] = useState({
        alert: "",
        message: "",
        alertVisibility: false
    });

    const handleChange = (event) => {
        setFormData({
            name: event.target.name,
            value: event.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get('http://localhost:5500/login', { params: formData }).then((response) => {
            const { data } = response;
            console.log(data["login_status"]);
            if (data["login_status"] === "success") {
                setSuccessAlert({ alert: "Success", message: "you're login to brightcareer...!", alertVisibility: true });
                setTimeout(() => {
                    if (data["role"] === "teacher") {
                        const choice = {"userId": data["userId"], "teacher": data["userEmail"], "role": data["role"], "userName": data["userName"]};
                        localStorage.setItem("user", JSON.stringify(choice));
                        window.location.href = "/dashboard";
                    } else if (data["role"] === "student") {
                        const choice = {"userId": data["userId"], "student": data["userEmail"], "role": data["role"], "userName": data["userName"]};
                        localStorage.setItem("user", JSON.stringify(choice));
                        window.location.href = "/student-dashboard";
                    }
                }, 600);
            } else if (data["login_status"] === "warning") {
                setSuccessAlert({ alert: "Warning", message: "Incorrect password please recheck the password.", alertVisibility: true });
            } else {
                setSuccessAlert({ alert: "Warning", message: "User not exists, please first register.", alertVisibility: true });
            }
        }).catch((err) => {
            if (err) {
                setSuccessAlert({ alert: "Warning", message: "Server is not responded...!", alertVisibility: true });
            }
        });
    }
    return (
        <section className="login mt-4">
            <span className="back ms-4">
                <a href="/"><i className="fa fa-home"></i> Home</a>
            </span>
            <span className="logo-img d-flex mb-2 justify-content-center">
                <img src={logo} alt="bright career" width="200px" height="70px" />
            </span>
            <h1 className="text-center">Login System</h1>
            <form action="" method="post" className="form login-form w-50 m-auto d-flex p-4 mt-4" onSubmit={handleSubmit} >
                {successAlert.alertVisibility && (<div className="text-center" style={{ color: "brown" }}>{successAlert.alert}: {successAlert.message}</div>)}
                <input type="email" name="user-email" className="form-control mt-4" placeholder="example@gmail.com" onChange={handleChange} required />
                <input type="password" name="password" className="form-control mt-4" placeholder="password" onChange={handleChange} required />
                <span>
                    <input type="radio" name="role" id="student" value="student" onChange={handleChange} />
                    <label htmlFor="student" className="ms-2 mt-3">Student</label>
                </span>
                <span>
                    <input type="radio" name="role" id="teacher" value="teacher" onChange={handleChange} />
                    <label htmlFor="teacher" className="ms-2">Teacher</label>
                </span>
                <button type="submit" className="btn btn-primary mt-3"><i className="fa fa-user"></i> Login</button>
                <div className="other-links mt-4 text-center">
                    <a href="/forgot-password">Forgot Password?</a>
                    <span>If don't have account please <a href="/register">register here.</a></span>
                </div>
            </form>
        </section>
    );
}