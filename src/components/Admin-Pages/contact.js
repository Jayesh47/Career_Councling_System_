import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

export default function Contact() {
    const user = JSON.parse(localStorage.getItem("user"))["userId"];
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5500/contact-messages", { params: { userid: user } }).then((response) => {
            const data = response.data;
            setMessages(data["result"]);
        })
    }, []);
    return (
        <section className="contact">
            <Navbar />
            <div className="display-msg container mt-5">
                <h2 className="mb-4">Contact Us ({messages.length})</h2>
                {
                    messages.map((msg, index) => (
                        <div className="card mt-4" key={index}>
                            <div className="card-header">
                                {msg["student_email"]}
                            </div>
                            <div className="card-body">
                                <blockquote className="blockquote mb-0">
                                    <p>{msg["contact_desc"]}</p>
                                </blockquote>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}