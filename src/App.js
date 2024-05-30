import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage/homepage';
import LoginSystem from './components/loginSystem/login';
import Register from './components/loginSystem/register';
import CourseDetails from './components/Dashboard/CourseDetails';
import Counslor_details from './components/Dashboard/counslor-details';
import StudentProfile from './components/Dashboard/studentprofile';
import Dashboard from './components/Dashboard/Dashboard';
import AddNewCourse from './components/Admin-Pages/AddNewCourse';
import CreateSession from './components/Admin-Pages/CreateSession';
import Logout from './components/Admin-Pages/logout';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import Payment from './components/Dashboard/payment';
import AdminPanel from './components/Admin-Pages/Admin';
import Contact from './components/Admin-Pages/contact';

function App() {
  return (
    <div className="StudentCouncling">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginSystem />} />
          <Route path='/register' element={<Register />} />
          <Route path='/course-details' element={<CourseDetails />} />
          <Route path='/book-counslor' element={<Counslor_details />} />
          <Route path='/students' element={<StudentProfile />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/add-new-course' element={<AddNewCourse />} />
          <Route path='/create-session' element={<CreateSession />} />
          <Route path='/student-dashboard' element={<StudentDashboard />} />
          <Route path='/enroll' element={<Payment />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path="/logout" element={<Logout />} />
          <Route path='/Contact-us' element={<Contact />}/>
        </Routes>
    </div>
  );
}

export default App;
