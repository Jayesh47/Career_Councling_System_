import React from 'react';
import logo from '../../static/logo.png';
import Footer from '../Footer/footer.js';
import Hero from '../hero/hero.js';
// import {useParams} from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="wrapper">
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="BrightCareer" />
                </div>
                <h1></h1>
                <ul className="nav-items mt-3">
                    <li className="nav-link m-3 p-0"><a href="/" className="d-flex p-2"><i className="fa fa-home"></i> Home</a></li>
                    <li className="nav-link m-3 p-0"><a href="#about" className="d-flex p-2"><i className="fa fa-info-circle"></i> About</a></li>
                    <li className="nav-link m-3 p-0"><a href="#Subscription" className="d-flex p-2"><i className="fas fa-inbox"></i> Contact</a></li>
                    <li className="nav-link m-3 p-0"><a href="/login" className="d-flex p-2"><i className="fa fa-user"></i> Login</a></li>
                </ul>
            </nav>
            <Hero />
            <Footer />
        </div>
    )
}