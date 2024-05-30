import React, { useEffect, useState } from "react";
import './dashboard.css';
import Footer from "../Footer/footer";
import { useLocation } from "react-router-dom";
import axios from "axios";
import StudentNavbar from "./studentNavbar";

export default function CourseDetails() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get('courseid');
    let [course, setCourse] = useState([]);
    let [msg, setMsg] = useState("");
    
    useEffect(() => {
        try {
            axios.get("http://localhost:5500/course-Details", { params: { data: value } }).then((response) => {
                const allData = response.data["course_details"];
                if (allData === false) {
                    setMsg("No Data Found.");
                }else {
                    setCourse(allData);
                }
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <section className="wrapper details">
            <StudentNavbar />
            <h2>{msg}</h2>
            {
                course.map((courses, i) => (
                    <div className="container">
                        <div className="course-img m-4">
                            <img src={"http://localhost:5500/upload/" + courses["course_thumbnail"]} alt="" width="50%" />
                            <div className="about-course">
                                <h3 className="w-75 mb-5">{courses["course_title"]}</h3>
                                <h4>Price: Rs. {courses["course_price"]}.00 only</h4>
                                <span className="ratings">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                </span>
                                <br />
                                <span>
                                    <i className="fas fa-eye"></i> (200 - Reviews)
                                </span>
                                <br />
                                <a href={`/enroll?courseId=${value}&coursePrice=${courses["course_price"]}`} className="enroll-btn btn btn-primary w-75">Enroll Now</a>
                            </div>
                        </div>
                        <div className="pov d-flex mt-5 m-4">
                            <div className="description w-50">
                                <h5>Total Time Duration: {courses["course_duration"]} Days.</h5>
                                <h5>Description:</h5>
                                <p className="mt-4">{courses["course_description"]}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            <Footer />
        </section>
    )
}