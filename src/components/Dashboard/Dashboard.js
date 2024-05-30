import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../Admin-Pages/Navbar";
import DeleteButton from "../Admin-Pages/DeleteButton";
import SessionBooking from "./session_book";

export default function Dashboard() {
    const user = localStorage.getItem("user");
    const [userData, setUserData] = useState({
        name: "",
        profession: "",
        email: "",
        exp: ""
    });
    let data = JSON.parse(user);
    const [course, setCourse] = useState([]);
    const [session, setSession] = useState([]);
    const [book, setbook] = useState([]);

    if (user === null) {
        console.log("404 - UNKNOWN SOURCE DETECTED.");
    } else {
        window.onload = () => {
            axios.get("http://localhost:5500/dashboard", { params: data }).then((response) => {
                const user_data = response.data["result"];

                if (data["role"] === "teacher") {
                    setUserData({
                        name: user_data[0]["Admin_Name"],
                        profession: user_data[0]["Admin_Profession"],
                        email: data["teacher"],
                    });
                }
                // } else if (data["role"] === "student") {
                //     setUserData({
                //         name: user_data["StudentName"],
                //         email: user_data["StudentEmail"],
                //         exp: user_data["StudentQual"],
                //     });
                // }
            }).catch((err) => {
                console.log("data not found. - \n", err);
            })
        }
    }
    useEffect(() => {
        axios.get('http://localhost:5500/view-all', { params: { 'id': data["userId"], 'view': 'courses' } }).then((res) => {
            const allData = res.data["allCourses"];
            setCourse(allData);
        })
    }, [data["userId"]]);
    useEffect(() => {
        axios.get('http://localhost:5500/view-all', { params: { 'id': data["userId"], 'view': 'sessions' } }).then((res) => {
            const allData = res.data["allSessions"];
            setSession(allData);
        })
    }, [data["userId"]]);
    useEffect(() => {
        axios.get('http://localhost:5500/booked-sessions', { params: data }).then((res) => {
            const allData = res.data["bookings"];
            setbook(allData);
        })
    }, [data["userId"]]);
    const formateDate = (datestring) => {
        const date = new Date(datestring);
        return date.toLocaleDateString();
    }

    return (
        <section className="dashboard-page wrapper">
            <Navbar />
            <div className="main-dashboard container mt-4">
                <h3 className="text-center">Welcome Back {userData["name"]}</h3>
            </div>
            <div className="container course-lists">
                <ul className="course-Items">
                    <h2 className="mb-5">All Courses</h2>
                    {
                        course.map((courses, index) => (
                            <li className="list-item d-flex p-3 mb-4" key={index}>
                                <a href="#">
                                    <h4>{courses.course_title}</h4>
                                </a>
                                <span>uploaded at: {formateDate(courses.uploaded_at)}</span>
                                <DeleteButton id={courses.course_id} type="course" />
                            </li>
                        ))
                    }
                </ul>
            </div>
            <hr />
            <div className="container mt-4">
                <ul className="course-Items">
                    <h2 className="mb-5">All Sessions</h2>
                    {
                        session.map((sessions, index) => (

                            <li className="list-item d-flex p-3 mt-4" key={index}>
                                <a href="#">
                                    <h4>{sessions.session_title}</h4>
                                </a>
                                <span>session conducted at: {formateDate(sessions.session_date)}</span>
                                <DeleteButton id={sessions.session_id} type='session' />
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="container">
                <h2 className="mb-5">Sessions Bookings</h2>
                {
                    book.map((booking) => (
                        <SessionBooking session_title={booking.session_title} studentName={booking.student_name} slot={booking.slot_time} />
                    ))
                }
            </div>
        </section>
    )
}