import React, { useReducer, useState } from "react";
import './register.css';
import logo from '../../static/logo.png';
import axios from "axios";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function Register() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isAuth, setIsAuth] = useState(false);
    const [successAlert, setSuccessAlert] = useState({
        message: "",
        color: "",
        alertVisibility: false, 
    });
    const [process, setProcess] = useState('');

    const isCheck = () => {
        const pass = formData["register-password"];
        const confirm = formData["confirm-password"];
        if (pass !== confirm) {
            setIsAuth(true);
        } else if (pass === confirm) {
            setIsAuth(false);
        }
    }
    const handleChange = (event) => {
        isCheck();
         setFormData({
            name: event.target.name,
            value: event.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.get('http://localhost:5500/register', { params: formData }).then((response) => {
            const { data } = response;
            const { status, message } = data;
            if (response.status === 200) {
                setTimeout(() => {
                    setSuccessAlert({
                        message: message,
                        color: status,
                        alertVisibility: true,
                    });
                }, 1500);
                setProcess("Waiting...!");
                setTimeout(() => {
                    setProcess("Processing...!");
                }, 1000);
                setTimeout(() => {
                    setSuccessAlert({
                        ...successAlert,
                        alertVisibility: false
                    });
                    if (status === "success") {
                        setProcess("Success...!");
                        window.location.href = "http://localhost:3000/login";
                    }else {
                        setProcess("");
                    }
                }, 3000);
            }
        }).catch((error) => {
            setSuccessAlert({message: "Server is not responded...!", color: "danger", alertVisibility: true});
        });
    };
    return (

        <section className="register mt-2">
            <span className="back ms-4">
                <a href="/"><i className="fa fa-home"></i> Home</a>
            </span>
            <span className="logo-img d-flex mb-2 justify-content-center">
                <img src={logo} alt="bright career" width="200px" height="70px" />
            </span>

            <h1 className="text-center">Register System</h1>
            <p style={{color: "red", textAlign: "center"}}>{process}</p>
            <form method="post" onSubmit={handleSubmit} className="register-form form d-flex w-50 m-auto p-4 mt-4">

                {successAlert.alertVisibility && (<div className={`alert alert-${successAlert.color} alert-dismissible fade show mb-1`} role="alert" >
                    <strong>{successAlert.color}: </strong> {successAlert.message}
                </div>)}

                <input type="text" name="register-name" id="register-name" className="form-control mt-4" placeholder="username" onChange={handleChange} required />

                <input type="email" name="register-email" id="register-email" className="form-control mt-4" placeholder="example@gmail.com" onChange={handleChange} required />
                
                <input type="text" name="qualification" id="qualification" className="form-control mt-4" placeholder="Qualifications" onChange={handleChange} required />

                <input type="password" name="register-password" id="register-password" className="form-control mt-4" placeholder="password" onChange={handleChange} required />

                <input type="password" name="confirm-password" id="confirm-password" className="form-control mt-4" placeholder="confirm password" onChange={handleChange} required />

                <span><input type="radio" name="role" id="student" className="mt-4" value="student" onChange={handleChange} />

                    <label htmlFor="student">Student</label></span>

                <span><input type="radio" name="role" id="teacher" value="teacher" onChange={handleChange} />

                    <label htmlFor="teacher">Teacher</label></span>

                <button type="submit" className="btn btn-primary mt-4"><span>{isAuth && "😡"} {!isAuth && "😀"}</span> Register</button>

                <div className="other-links mt-4 text-center">
                    <span>if already have account please <a href="/login">login here.</a></span>
                </div>
            </form>
        </section>
    );
}