import React, { useEffect, useReducer, useState } from "react";
import Navbar from "./Navbar";
import '../Dashboard/dashboard.css';
import axios from "axios";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function AddNewCourse() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [image, setImage] = useState(null);
    const Id = JSON.parse(localStorage.getItem("user"))["userId"];
    const [message, setMessage] = useState({
        msg: "",
        alertMsg: false
    });

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    }
    const handleChange = (event) => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }
    const HandleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("course-name", formData["course-name"]);
        formDataToSend.append("course-price", formData["course-price"]);
        formDataToSend.append("course-description", formData["course-description"]);
        formDataToSend.append("course_time", formData["course-time"]);
        formDataToSend.append("thumbnail", image);
        formDataToSend.append("Id", Id);
        
        axios.post("http://localhost:5500/add-course", formDataToSend).then((response) => {
            if (response.data.status === "success") {
                setMessage({
                    msg: response.data.message,
                    alertMsg: true
                });
            } else {
                setMessage({
                    msg: "Something Went Wrong, please retry.",
                    alertMsg: true
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    
    return (
        <section className="add-new-course">
            <Navbar />
            {message.alertMsg && (<div className={`alert alert-danger alert-dismissible fade show mb-1`} role="alert" >
                <strong>Success: </strong> {message.msg}
            </div>)}
            <div className="container mt-5">
                <h1>Add New Course</h1>
                <form action="" method="post" className="form mt-4" onSubmit={HandleSubmit} encType="multipart/form-data">
                    <label htmlFor="course-name">Course Name</label>
                    <input type="text" name="course-name" id="course-name" className="form-control mb-4" onChange={handleChange} placeholder="Course Name..." required />
                    <label htmlFor="thumbnail">Course Thumbnail</label>
                    <input type="file" name="thumbnail" id="thumbnail" className="form-control mb-4" onChange={handleImageChange} required />
                    <label htmlFor="course-price">Course Price</label>
                    <input type="number" name="course-price" id="course-price" className="form-control mb-4" onChange={handleChange} placeholder="Course Price..." required />
                    <label htmlFor="course-price">Course Duration</label>
                    <input type="number" name="course-time" id="course-time" className="form-control mb-4" onChange={handleChange} placeholder="Total Course Duration in hours..." required />
                    <label htmlFor="course-description">Course Description</label>
                    <textarea name="course-description" id="course-description" className="form-control mb-4" onChange={handleChange} placeholder="Course Description..." required />
                    <button className="btn btn-primary w-25 mb-4">Add</button>
                </form>
            </div>
        </section>
    )
}