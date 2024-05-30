import React, { useReducer, useState } from "react";
import StudentNavbar from "./studentNavbar";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Payment() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseID = queryParams.get("courseId");
    const coursePrice = queryParams.get("coursePrice");
    const user = JSON.parse(localStorage.getItem("user"));
    const [Alert, setAlert] = useState({
        check: false, 
        status: "",
        msg: ""
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get("http://localhost:5500/purchase-course", {params: {"userid": user["userId"], "courseId": courseID}}).then((response) => {
            const data = response.data;
            setAlert({
                check: true,
                status: data["status"],
                msg: data["msg"]
            });
        }).catch((err) => {console.log(err)});
    }

    return (
        <section className="wrapper">
            <StudentNavbar />
            <div className="container">
                <h2 className="mt-4">Buy Your Course.</h2>
                {Alert.check && <span>{Alert.status}: {Alert.msg}</span> }
                <form action="" onSubmit={handleSubmit} className="form" method="get">
                    <input type="text" name="username" className="form-control mt-4" placeholder="credit card name..." />
                    <input type="number" name="credit" className="form-control mt-4" placeholder="credit card number..." />
                    <input type="text" name="cvv" className="form-control mt-4" placeholder="cvv number..." />
                    <input type="number" name="payment" className="form-control mt-4" placeholder={coursePrice} readOnly />
                    <button type="submit" className="btn btn-success mt-4 w-25">submit</button>
                </form>
            </div>
        </section>
    )
}