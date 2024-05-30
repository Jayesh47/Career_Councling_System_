import React, { useEffect, useState } from "react";
import StudentNavbar from "./studentNavbar";
import axios from "axios";
import "./dashboard.css";

export default function StudentDashboard() {
    let [course, setCourse] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    let [sessionData, setData] = useState([]);

    useEffect(() => {
        try {
            axios.get("http://localhost:5500/provide-courses", { params: { data: "curriculum" } }).then((response) => {
                const allData = response.data["allData"];
                if (allData.length > 0) {
                    setCourse(allData);
                } else {
                    console.log("no data received.");
                }
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5500/sessions').then((response) => {
            const data = response.data["session"];
            setData(data);
        });
    }, []);

    return (
        <section className="student-dashboard">
            <StudentNavbar />
            <div className="container mt-5 mb-5">
                <h1>Welcome {user["userName"]},</h1>
            </div>
            <main className="main-content m-5">
                <div className="courses">
                    {
                        course.map((courseItems, i) => (
                            <div className="course" key={i}>
                                <div className="course-image">
                                    <img src={"http://localhost:5500/upload/" + courseItems["course_thumbnail"]} alt="" />
                                </div>
                                <div className="course-details mt-4">
                                    <h4>{courseItems["course_title"]}</h4>
                                    <h5>Price: Rs. {courseItems["course_price"]} /-</h5>
                                    <a href={"/course-details?courseid=" + courseItems["course_id"]} className="btn btn-danger">Book Now</a>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <hr />
                <h3 className="text-center">Available Councling Sessions</h3>
                <div className="all-sessions d-flex mt-5">
                    {
                        sessionData.slice().reverse().map((session, i) => (
                            <div className="session ms-5" key={i}>
                                <img src={'http://localhost:5500/upload/' + session["admin_image"]} width="65%" height="150px" />
                                <div className="session-details">
                                    <h4>{session["session_title"]}</h4>
                                    <h5>{session["Admin_Name"]}</h5>
                                    <span><i className="fa fa-star"></i> 4.5</span>
                                </div>
                                <a href={"/book-counslor?sid=" + session["session_id"]} className="btn btn-primary">View More</a>
                            </div>
                        ))
                    }
                </div>
            </main>
        </section>
    );
}
/*

*/