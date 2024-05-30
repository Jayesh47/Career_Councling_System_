// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import DeleteButton from "../Admin-Pages/DeleteButton";
import React from "react"

export default function SessionBooking({ session_title, studentName, slot }) {

    return (
        <div className="container mt-3 mb-3">
            <ul className="course-Items">
                <li className="list-item d-flex p-3 mt-4" key="">
                    <a href="#">
                        <h4 className="text-capitalize">{studentName}</h4>
                    </a>
                    <span><strong>session title:</strong> {session_title}</span>
                    <span><strong>slot time:</strong> {slot}</span>
                </li>
            </ul>
        </div>
    )
}