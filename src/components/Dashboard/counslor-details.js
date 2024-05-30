import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentNavbar from "./studentNavbar";
import { useLocation } from "react-router-dom";
import '../hero/hero.css';
import ContactUs from "./contact-form";

export default function Counslor_details() {
    const user = JSON.parse(localStorage.getItem("user"))["userId"];
    let [sessionData, setData] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get('sid');
    const [formData, setFormData] = useState({});
    const [Alert, setAlert] = useState({
        alertCheck: false,
        msg: ""
    })

    useEffect(() => {
        axios.get('http://localhost:5500/sessions-details', { params: { sid: value } }).then((response) => {
            const data = response.data["session"];
            setData(data);
        });
    }, []);
    function formatDate() {
        let year, month, day, formattedDate;
        sessionData.map((dt) => {
            const dateStr = new Date(dt["session_date"]);
            year = dateStr.getFullYear();
            month = String(dateStr.getMonth() + 1).padStart(2, "0");
            day = String(dateStr.getDate()).padStart(2, "0");
            formattedDate = `${day}-${month}-${year}`;
        });
        return formattedDate;
    }

    const handleChange = (e) => {
        setFormData({
            "timeslot": e.target.value,
            "userId": user,
            "teacher_id": sessionData[0]["Admin_Id"],
            "session_id": sessionData[0]["session_id"]
        })
    } 
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get("http://localhost:5500/book-session", {params: formData}).then((response) => {
            const data = response.data;
            if (data.status == "success") {
                setAlert({
                    alertCheck: true,
                    msg: data.msg
                });
            }else {
                setAlert({
                    alertCheck: true,
                    msg: "your slot is not booked"
                })
            }
        });
    }

    return (
        <section className="Teachers-Discription">
            <StudentNavbar />
            {
                sessionData.map((session, i) => (
                    <div className="about-teacher container mt-5" key={i}>
                    <img src={"http://localhost:5500/upload/" + session["admin_image"]} className="m-3" width="200px" height="200px" />
                    <h1>About Teacher</h1>
                    <p><strong>{session["session_title"]}</strong></p>
                    <p><strong>Counclor Name:- </strong> {session["Admin_Name"]}</p>
                    <p><strong>Qualification:- </strong> {session["Admin_Profession"]}</p>
                    <p><strong>Session Start Time At: </strong> {session["session_start_time"]}</p>
                    <p><strong>Session End Time At: </strong> {session["session_end_time"]}</p>
                    <p>A very experienced teacher having in deapth knowledge of in his field as well.<br /> Having 5 years experience in teaching field.</p>
                </div>
                ))
            }
            <p className="ms-5 mt-5">Select Timeslot</p>
            {Alert.alertCheck && (<span className="ms-5">{Alert.msg}</span>)}
            <form action="" className="form mt-3 container" onSubmit={handleSubmit}>
                <select name="timeslot" id="" className="form-select" onChange={handleChange}>
                    <option>Select</option>
                    <option>From 4:00 to 5:00</option>
                    <option>From 5:00 to 6:00</option>
                    <option>From 6:00 to 7:00</option>
                    <option>From 8:00 to 9:00</option>
                </select>
                <button type="submit" className="btn btn-primary mt-4">Book Now</button>
            </form>
            <ContactUs teacher_id={sessionData[0]} />
        </section>
    );
}
