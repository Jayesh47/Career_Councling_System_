import React from "react";
import logo from "../../static/logo.png";

export default function StudentNavbar() {
    return (
        <div className="wrapper">
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="BrightCareer" />
                </div>
                <h1></h1>
                <ul className="nav-items mt-3">
                    <li className="nav-link m-3 p-0"><a href="/student-dashboard" className="d-flex p-2"><i className="fa fa-home"></i> Dashboard</a></li>
                    <li className="nav-link m-3 p-0"><a href="/students" className="d-flex p-2"><i className="fa fa-home"></i> Student Profile</a></li>
                    <li className="nav-link m-3 p-0"><a href="/logout" className="d-flex p-2"><i className="fa fa-user"></i> Logout</a></li>
                </ul>
            </nav>
        </div>
    );
}