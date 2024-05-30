import React, {useReducer, useState} from "react";
import banner_1 from '../../static/banner.jpg';
import axios from "axios";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

export default function ContactUs({teacher_id}){
    const [formData, setFormData] = useReducer(formReducer, {});
    const [msg, setmsg] = useState({check: false});

    const contactChange = (event) => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }
    const contactSubmit = (e) => {
        e.preventDefault();
        formData["teacher_id"] = teacher_id["teacher_id"];

        axios.get("http://localhost:5500/contact-us", {params: formData}).then((response) => {
            const data = response.data;
            console.log(data["status"]);
            if (data["status"] === "success") {
                setmsg({check: true});
            }else {
                setmsg({check: false});
            }
        });
    }

    return(
        <section className="Contact mt-5 mb-5" id="Subscription">
        <h1 className="text-center">CONTACT US</h1>
        <span className="underline d-flex m-auto mb-4" />
        <div className="contact-detail d-flex">
            <div className="contact-img">
                <img src={banner_1} alt="Contact-Form | brightcareer" height="300px" />
            </div>
            <div className="contactus ms-4">
                <form method='post' onSubmit={contactSubmit} className="form contactForm">
                    <label htmlFor="contactEmail">Email Address</label>
                    <input type="email" name="contactEmail" className="form-control" id="contactEmail" placeholder="Contact@email.com" onChange={contactChange} />
                    <label htmlFor="contactQuery">Description</label>
                    <textarea name="contactQuery" id="contactQuery" className="form-control " placeholder="Describe Your Query Here...." onChange={contactChange} ></textarea>
                    <button type="submit" className="btn btn-danger mt-4 w-50">{msg.check ? "Subscribed" : "Subscribe"}</button>
                </form>
            </div>
        </div>
    </section>
    );
}