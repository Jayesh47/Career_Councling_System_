import React, { useState, useReducer } from "react";
import Navbar from "./Navbar";
import '../Dashboard/dashboard.css';
import axios from "axios";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function CreateSession() {
    const [formitems, setformitems] = useReducer(formReducer, {});
    const Id = JSON.parse(localStorage.getItem("user"))["userId"];
    const [message, setMessage] = useState({
        msg: "",
        alertMsg: false
    });

    const isTimeString = () => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
        let check = timeRegex.test(formitems["start-time"]);
        console.log(check);
        if (check === false) {
            return false;
        } else if (check === true) {
            return true;
        }
        check = timeRegex.test(formitems["end-time"]);
        if (check === false) {
            return false;
        } else {
            return true;
        }
    }

    const handleChange = (event) => {
        setformitems({
            name: event.target.name,
            value: event.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const check = isTimeString();
        if (check === false) {
            setMessage({
                msg: "Please correct the time value. provide in this format - 00:00 AM",
                alertMsg: true
            });
        } else {
            axios.get('http://localhost:5500/create-session', { params: [Id, formitems] })
                .then((response) => {
                    const data = response.data;
                    if (data["status"] === "success") {
                        setMessage({
                            msg: data["message"],
                            alertMsg: true
                        })
                    } else {
                        setMessage({
                            msg: "Something went wrong, please retry.",
                            alertMsg: true
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                })
        }
    }
    return (
        <section className="add-new-course">
            <Navbar />
            {message.alertMsg && (<div className={`alert alert-danger alert-dismissible fade show mb-1`} role="alert" >
                <strong>Success: </strong> {message.msg}
            </div>)}
            <div className="container mt-5">
                <h1>Create Session</h1>
                <form action="" method="post" className="form mt-4" onSubmit={handleSubmit}>
                    <label htmlFor="Councling-name">Councling Title</label>
                    <input type="text" name="Councling-name" id="Councling-name" className="form-control mb-4" placeholder="Councling Title..." onChange={handleChange} />
                    <label htmlFor="start-time">Start Time</label>
                    <input type="datetime" name="start-time" id="start-time" className="form-control mb-4" placeholder="Session Starting Time" onChange={handleChange} />
                    <label htmlFor="end-time">End Time</label>
                    <input type="datetime" name="end-time" id="end-time" className="form-control mb-4" placeholder="Session Ending Time" onChange={handleChange} />
                    <label htmlFor="session-date">Session Date</label>
                    <input type="date" name="session-date" id="session-date" className="form-control mb-4" placeholder="Session Starting Date" onChange={handleChange} />
                    <button type="submit" className="btn btn-primary">Create Session</button>
                </form>
            </div>
        </section>
    )
}