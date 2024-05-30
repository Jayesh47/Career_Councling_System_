import React, { useReducer } from 'react';
import './hero.css';
import banner_1 from '../../static/banner.jpg';
import banner_2 from '../../static/banner-2.jpg';
import banner_3 from '../../static/banner-3.jpg';
import hero from '../../static/hero.png';

export default function Hero() {    
    return (
        <section className='Banner'>
            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={banner_1} className="d-block w-100" alt="BrightCareer" />
                    </div>
                    <div className="carousel-item">
                        <img src={banner_2} className="d-block w-100" alt="BrightCareer" />
                    </div>
                    <div className="carousel-item">
                        <img src={banner_3} className="d-block w-100" alt="BrightCareer" />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="Tag">
                <img src={hero} alt="BrightCareer" className="TagImage" />
                <p className="TagLine">"Time Is The Limited Resource, Don't Be Waste It."</p>
            </div>
            {/* about us message */}
            <section className="About-us mt-5 mb-5" id="about">
                <h1 className="text-center">ABOUT US</h1>
                <span className="underline d-flex m-auto mb-4" />
                <div className="about-content d-flex w-75 m-auto">
                    <div className="about-para mr-4 ps-2">
                        Hello, My name is "Jayesh Lohar" and my project partner name is "Kapil Sharma".
                        This project name is brightcareer and basically its designed on "Career Councling
                        System" which is used in choosing best career as per the choice of individual student,
                        This project's frontend is designed in React.js and the backend is designed in Node.js
                        this is our college minor project. In this project if student is already registered it
                        can easily login else its have to registered itself then it can redirect on student dashboard
                        where student can explores courses and enroll in it, also it can book their councling teacher
                        and live chat to students. When teachers can login, teacher can create sessions, can reply
                        answers and also sell our course on it.
                    </div>
                    <div className="about-img w-50 ms-4">
                        <img src={banner_2} alt="about-us | brightcareer" width="300px" height="280px" />
                    </div>
                </div>
            </section>
        </section>
    );
}