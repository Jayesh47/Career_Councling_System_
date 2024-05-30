import React from "react";
import logo from "../../static/logo.png";

export default function Navbar() {
    return (
        <div className="wrapper">
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="BrightCareer" />
                </div>
                <h1></h1>
                <ul className="nav-items mt-3">
                    <li className="nav-link m-3 p-0"><a href="/dashboard" className="d-flex p-2"><i className="fa fa-home"></i> Dashboard</a></li>
                    <li className="nav-link m-3 p-0"><a href="/add-new-course" className="d-flex p-2"><i className="fa fa-book"></i> Add New Course</a></li>
                    <li className="nav-link m-3 p-0"><a href="/create-session" className="d-flex p-2"><i className="fas fa-inbox"></i> Create Session</a></li>
                    <li className="nav-link m-3 p-0"><a href="/admin" className="d-flex p-2"><i className="fas fa-user-circle"></i> Admin</a></li>
                    <li className="nav-link m-3 p-0"><a href="/Contact-us" className="d-flex p-2"><i class="fas fa-comment-alt"></i> Contact-us</a></li>
                    <li className="nav-link m-3 p-0"><a href="/logout" className="d-flex p-2"><i className="fa fa-user"></i> Logout</a></li>
                </ul>
            </nav>
        </div>
    );
}