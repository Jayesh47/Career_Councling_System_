const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const multer = require('multer');
// const path = require('path');

var app = express();
const http = require('http').Server(app);
app.use(cors());

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "brightcareer",
    debug: true
});


app.get('/dashboard', (req, res) => {
    const data = req.query;
    if (data["role"] === "teacher") {
        pool.query(`SELECT * FROM admin_counsellor WHERE Admin_Id=${data["userId"]}`, (err, result, field) => {
            res.status(200).send({"result": result});
        });
    }
});
app.get('/booked-sessions', (req, res) => {
    const data = req.query;
    pool.query(`select distinct s.student_name, t.session_title, b.* FROM studentregister as s, session_booking as t, book_sessions as b WHERE b.student_id=s.student_Id && b.session_id=t.session_id && b.teacher_id=${data["userId"]}`, (err, result, field) => {
        console.log(result);
        res.status(200).send({"bookings": result});
    })
})

app.get('/register', async (req, res) => {
    let data = req.query;
    if (data["role"] === "student") {
        var password = crypto.createHash('sha256').update(data["register-password"]).digest('hex');

        pool.query(`INSERT INTO studentregister(student_name, student_email, student_qualifications, student_password) VALUES('${data["register-name"]}', '${data["register-email"]}', '${data["qualification"]}', '${password}')`);
        res.status(200).send({ "status": "success", "message": "Your Account is created successfully." });
    } else if (data["role"] === "teacher") {
        var password = crypto.createHash('sha256').update(data["register-password"]).digest('hex');

        pool.query(`INSERT INTO admin_counsellor(Admin_Name, Admin_email, Admin_Profession, Admin_password) VALUES('${data["register-name"]}', '${data["register-email"]}', '${data["qualification"]}', '${password}')`);
        res.status(200).send({ "status": "success", "message": "Your Account is created successfully." });
    } else {
        res.status(200).send({ "status": "warning", "message": "Invalid Credentials." });
    }
});

app.get('/login', async (req, res) => {
    var data = req.query;
    if (data["role"] === "teacher") {
        pool.query(`select * from admin_counsellor where Admin_email='${data["user-email"]}'`, (err, response, field) => {
            if (err) {
                console.log(err);
            } else {
                var password = crypto.createHash('sha256').update(data["password"]).digest('hex');
                password = password.slice(0, 30);
                response.forEach(con => {
                    console.log(con["Admin_password"]);
                    if (con["Admin_password"] === password) {
                        res.status(200).send({ login_status: "success", role: "teacher", userId: con["Admin_Id"], userEmail: con["Admin_email"], userName: con['Admin_Name'] });
                    } else {
                        res.status(200).send({ login_status: "warning" });
                    }
                });
            }
        });
    } else if (data["role"] === "student") {
        pool.query(`select * from studentregister where student_email='${data["user-email"]}'`, (err, response, field) => {
            if (err) {
                res.status(200).send({ login_status: "warning" });
            } else {
                var password = crypto.createHash('sha256').update(data["password"]).digest('hex');
                password = password.slice(0, 30);
                response.forEach(con => {
                    if (con["student_password"] === password) {
                        res.status(200).send({ login_status: "success", role: "student", userId: con["student_Id"], userEmail: data["user-email"], userName: con["student_name"] });
                    } else if (con["student_password"] === password) {
                        res.status(200).send({ login_status: "incorrect" });
                    }
                });
            }
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload');
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const dd = date.getDate();
        const mm = date.getMonth();
        const yy = date.getFullYear();
        cb(null, `${dd + "-" + mm + "-" + yy}_${file.originalname}`);
    }
})

const upload = multer({ storage });

app.use(express.static('public'));

app.post('/add-course', upload.single('thumbnail'), async (req, res) => {
    let courseName = req.body["course-name"];
    let coursePrice = req.body["course-price"];
    let courseDesc = req.body["course-description"];
    let courseTime = req.body["course_time"];
    let adminId = req.body["Id"];
    const date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth();
    const yy = date.getFullYear();
    let thumbnail = dd + "-" + mm + "-" + yy + "_" + req.file.originalname;
    pool.query(`INSERT INTO course(admin_id, course_thumbnail, course_title, course_description, course_price, course_duration) VALUES ('${adminId}', '${thumbnail}', '${courseName}', '${courseDesc}', '${coursePrice}', '${courseTime}')`);
    res.status(200).send({ "status": "success", message: "Your course is created successfuly." });
});

app.get('/create-session', (req, res) => {
    let Id = req.query[0];
    let data = req.query[1];
    console.log(data["session-date"]);
    pool.query(`insert into session_booking(teacher_id, session_title, session_date, session_start_time, session_end_time) VALUES('${Id}', "${data["Councling-name"]}", '${data["session-date"]}', '${data["start-time"]}', '${data["end-time"]}')`);
    res.status(200).send({ "status": "success", "message": "Your session is created successfully." });
});

app.get('/view-all', async (req, res) => {
    let admin_id = req.query;
    if (admin_id["view"] === "courses") {
        pool.query(`SELECT * FROM course WHERE admin_id='${admin_id["id"]}'`, (err, result, field) => {
            if (err) {
                console.log("internal error occured at: 92");
            }
            res.status(200).send({ allCourses: result });
        })
    } else if (admin_id["view"] === "sessions") {
        pool.query(`SELECT * FROM session_booking WHERE teacher_id='${admin_id["id"]}'`, (err, result, field) => {
            if (err) {
                console.log("internal error occured at: 92");
            }
            res.status(200).send({ allSessions: result });
        })
    }
});

app.get('/delete-item', async (req, res) => {
    let data = req.query;
    if (data[1] === "course") {
        pool.query(`DELETE FROM course WHERE course_id=${data[0]}`);
        res.status(200).send({ "status": "success", "message": "Deleted Successfuly." });
    } else if (data[1] === "session") {
        pool.query(`DELETE FROM session_booking WHERE session_id=${data[0]}`);
        res.status(200).send({ "status": "success", "message": "Deleted Successfuly." });
    } else if (data[1] === "purchase") {
        pool.query(`DELETE FROM course_purchase WHERE course_id=${data[0]}`);
        res.status(200).send({ "status": "success", "message": "Deleted Successfuly." });
    }
});


app.get("/provide-courses", (req, res) => {
    let data = req.query;
    if (data["data"] == "curriculum") {
        pool.query("SELECT course_id, course_thumbnail, course_title, course_price, uploaded_at FROM course", (err, result, field) => {
            if (err) {
                console.log("error occurred.", err);
            }
            res.status(200).send({ allData: result });
        })
    }
});

app.get("/course-Details", (req, res) => {
    let data = req.query;
    pool.query(`SELECT * FROM course WHERE course_id=${data["data"]}`, (err, result, field) => {
        if (err) {
            console.log("error occurred.", err);
        }
        if (result.length > 0) {
            res.status(200).send({ course_details: result });
        } else {
            res.status(200).send({ course_details: false });
        }
    });
});

let userData = [];
app.get("/user-details", (req, res) => {
    const data = req.query;
    if (data["user_role"] === "student") {
        pool.query(`SELECT student_name, student_email, student_qualifications, student_password FROM studentregister WHERE student_Id=${data["userId"]}`, (err, result, field) => {
            if (err) {
                console.log(err);
            }
            result.map((student) => {
                userData.push(student["student_name"]);
                userData.push(student["student_email"]);
                userData.push(student["student_qualifications"]);
                userData.push(student["student_password"]);
            });
        });

        pool.query(`SELECT c.course_title, c.course_id, p.payment_day FROM course as c JOIN course_purchase as p ON p.course_id=c.course_id WHERE p.student_id=${data["userId"]}`, (err, result, field) => {
            if (err) {
                console.log(err);
            }
            const purchase = [];
            if (result.length > 0) {
                result.map((course) => {
                    const x = { "id": course["course_id"], "title": course["course_title"], "pay": course["payment_day"] }
                    purchase.push(x);
                });
                console.log(purchase);
                res.status(200).send({ userDetails: { name: userData[0], email: userData[1], qualification: userData[2] }, purchaseData: purchase });
            } else {
                res.status(200).send({ userDetails: { name: userData[0], email: userData[1], qualification: userData[2] }, purchaseData: "false" })
            }
        });
    }
});

app.get('/update-details', (req, res) => {
    const data = req.query;
    const userName = data["editData"]["user-name"];
    const userEmail = data["editData"]["user-email"];
    const userQual = data["editData"]["user-qualification"];
    const userPass = data["editData"]["user-password"];
    const newPass = data["editData"]["new-password"];

    var password = crypto.createHash('sha256').update(userPass).digest('hex');
    password = password.slice(0, 30);
    var new_pass = crypto.createHash('sha256').update(newPass).digest('hex');
    new_pass = new_pass.slice(0, 30);

    if (data["user_role"] === "student") {
        if (password == userData[3]) {
            pool.query(`UPDATE studentregister SET student_name='${userName}', student_email='${userEmail}', student_qualifications='${userQual}',student_password='${new_pass}' WHERE student_Id='${data["userId"]}'`, (err, result, field) => {
                if (err) {
                    console.log(err);
                }
                res.status(200).send({ MsgTitle: "success", Msg: "Your data is updated...!" });
                userData.length = 0;
            });
        } else {
            res.status(200).send({ MsgTitle: "warning", Msg: "Your old password is not matched, try again." });
        }
    }
});

app.get("/purchase-course", (req, res) => {
    const data = req.query;

    pool.query(`INSERT INTO course_purchase(course_id, payment_status, student_id) VALUES('${data["courseId"]}', '1', ${data["userid"]})`);
    res.status(200).send({ status: "Success", msg: "your course is added." });
})


app.post("/update-admin", upload.single('admin_profile'), async (req, res) => {
    const name = req.body["admin_name"];
    const email = req.body["admin_email"];
    const prof = req.body["admin_profession"];
    const pass = req.body["new_password"];
    const id = req.body["Id"];

    const date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth();
    const yy = date.getFullYear();
    let img = dd + "-" + mm + "-" + yy + "_" + req.file.originalname;
    
    var password = crypto.createHash('sha256').update(pass).digest('hex');
    pool.query(`update admin_counsellor set Admin_Name='${name}', Admin_email='${email}', Admin_Profession='${prof}', Admin_password='${password}', admin_image='${img}' WHERE Admin_Id='${id}'`);
    res.status(200).send({status: 'success', message: 'Your data is updated within a minute please wait...!'});
});

app.get("/admin-details", (req, res) => {
    const data = req.query;
    pool.query("SELECT * FROM admin_counsellor WHERE Admin_Id=" + data["id"], (err, result, field) => {
        if (err) {
            console.log("no user found.");
        }
        result.forEach(profile => {
            res.status(200).send({ profileName: profile["Admin_Name"], profileEmail: profile["Admin_email"], profileProf: profile["Admin_Profession"], profileImg: profile["admin_image"] });
        });
    })
})

app.get('/sessions', (req, res) => {
    pool.query(`SELECT s.*, a.Admin_Name, a.admin_image FROM admin_counsellor as a JOIN session_booking as s ON s.teacher_id=a.Admin_Id`, (err, result, field) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send({session: result});
    })
});

app.get('/sessions-details', (req, res) => {
    const sid = req.query;
    console.log(sid["sid"]);
    pool.query(`SELECT s.*, a.* FROM admin_counsellor as a JOIN session_booking as s ON s.teacher_id=a.Admin_Id WHERE s.session_id=${sid["sid"]}`, (err, result, field) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send({session: result});
    })
})

app.get('/book-session', (req, res) => {
    const data = req.query;
    pool.query(`INSERT INTO book_sessions (student_id, teacher_id, session_id, slot_time) values('${data["userId"]}', '${data["teacher_id"]}', '${data["session_id"]}', '${data['timeslot']}')`);
    res.status(200).send({status: "success", msg: "your slot is booked now!"});
})

app.get('/contact-us', (req, res) => {
    const data = req.query;
    pool.query(`INSERT INTO contact (student_email, teacher_id, contact_desc) VALUES ('${data["contactEmail"]}','${data["teacher_id"]}' , '${data["contactQuery"].toString()}')`);
    res.status(200).send({status: "success"});
});

app.get("/contact-messages", (req, res) => {
    const data = req.query;
    pool.query(`SELECT * FROM contact WHERE teacher_id='${data["userid"]}'`, (error, result, field) => {
        if (error) {
            console.log(error);
        }
        console.log(result);
        res.status(200).send({"result": result});
    })
})

var PORT = 5500;
http.listen(PORT, () => {
    console.log("http://localhost:5500");
});