import React, { useReducer, useState } from "react";
import Footer from "../Footer/footer";
import StudentNavbar from "./studentNavbar";
import axios from "axios";
import DeleteButton from "../Admin-Pages/DeleteButton";

const formReducer = (state, event) => ({
    ...state,
    [event.name]: event.value,
});

const StudentProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setData] = useState({});
    const [formData, setFormData] = useReducer(formReducer, {});
    const [Buy, setBuy] = useState([]);
    const [buying, setPurchase] = useState("");
    const [Msg, setMessage] = useState({
        status: "",
        message: ""
    });


    const handleChange = (event) => {
        setFormData({
            name: event.target.name,
            value: event.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get("http://localhost:5500/update-details", { params: { userId: user["userId"], user_role: user["role"], editData: formData } }).then((response) => {
            const data = response.data;
            const { MsgTitle, Msg } = data;
            if (MsgTitle === 'success') {
                setMessage({
                    status: MsgTitle,
                    message: Msg
                });
                const userDetails = { "userId": user["userId"], "student": formData["user-email"], "role": "student", "userName": formData["user-name"] };
                localStorage.setItem("user", JSON.stringify(userDetails));
            } else {
                setMessage({
                    status: MsgTitle,
                    message: Msg
                });
            }
        });
    }
    window.onload = () => {
        axios.get("http://localhost:5500/user-details", { params: { userId: user["userId"], user_role: user["role"] } }).then((response) => {
            const data = response.data;
            setData(data["userDetails"]);
            if (data["purchaseData"] == "false") {
                setPurchase("No course buying.");
            } else {
                console.log(data["purchaseData"]);
                setTimeout(() => {
                    if (data["purchaseData"] !== "" | data["purchaseData"] !== null)
                        setBuy(data["purchaseData"]);
                }, 1500);
                setPurchase("Courses You Have");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <section className="wrapper">
            <StudentNavbar />
            <div className="profile-form container mt-4">
                {Msg.status && <span>{Msg.status}: {Msg.message}</span>}
                <form action="" method="get" className="form mt-5 mb-5" onSubmit={handleSubmit}>
                    <input type="text" name="user-name" id="user-name" className="form-control" placeholder={userData["name"]} onChange={handleChange} />
                    <input type="email" name="user-email" id="user-email" className="form-control mt-4" placeholder={userData["email"]} onChange={handleChange} />
                    <input type="text" name="user-qualification" id="user-qualification" className="form-control mt-4" placeholder={"Qualifications: " + userData["qualification"]} onChange={handleChange} />
                    <input type="password" name="user-password" id="user-password" className="form-control mt-4" placeholder="Old Password" onChange={handleChange} />
                    <input type="password" name="new-password" id="new-password" className="form-control mt-4" placeholder="New Password" onChange={handleChange} />
                    <button type="submit" className="btn btn-primary mt-4 mb-4">Edit Your Profile</button>
                </form>
            </div>
            <div className="container mt-4">
                <ul className="course-Items">
                    <h2 className="mb-5">{buying}</h2>
                    {
                        Buy.map((buy, index) => (
                            <li className="list-item d-flex p-3 mt-4" key={index}>
                                <a href={"/course-details?courseid=" + buy.id}>
                                    <h4>{buy.title}</h4>
                                </a>
                                <span>purchased at: {buy.pay}</span>
                                <DeleteButton id={buy.id} type='purchase' />
                            </li>
                        ))
                    }
                </ul>
            </div>
            <Footer />
        </section>
    );
};

export default StudentProfile;