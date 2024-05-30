import React, { useEffect, useReducer, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import './Admin.css';

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function AdminPanel() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [profile, setProfile] = useState([]);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [message, setMessage] = useState({
        msg: "",
        alertMsg: false
    });

    useEffect(() => {
        if (user["role"] === "teacher") {
            axios.get('http://localhost:5500/admin-details', { params: { id: user["userId"] } }).then((response) => {
                const data = response.data;
                setProfile([data["profileName"], data["profileEmail"], data["profileImg"], data["profileProf"]]);
            }).catch((err) => console.log(err));
        }
    }, []);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    }
    const handleChange = (event) => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formItems = new FormData();
        formItems.append("admin_profile", image);
        formItems.append("admin_name", formData["admin_name"]);
        formItems.append("admin_email", formData["admin_email"]);
        formItems.append("admin_profession", formData["admin_profession"]);
        formItems.append("new_password", formData["new_password"]);
        formItems.append("Id", user["userId"]);
        
        axios.post("http://localhost:5500/update-admin", formItems) .then((response) => {
            console.log(response.data);
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
        <section className="admin">
            <Navbar />
            <div className="container mt-5 mb-5">
                <h3>Profile</h3>
                <img src={ "http://localhost:5500/upload/" + profile[2] } alt="" width="200px" height="200px" id="profile-pic" />
                <form action="" method="POST" className="form mt-3" onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type="file" name="admin_profile" className="form-control" onChange={handleImageChange} />
                    <input type="text" name="admin_name" className="form-control mt-4" placeholder={profile[0]} onChange={handleChange} />
                    <input type="email" name="admin_email" className="form-control mt-4" placeholder={profile[1]} onChange={handleChange} />
                    <input type="text" name="admin_profession" className="form-control mt-4" placeholder={profile[3]} onChange={handleChange} />
                    <input type="password" name="new_password" className="form-control mt-4" placeholder="New Password" onChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-4">Save</button>
                </form>
            </div>
        </section>
    );
}