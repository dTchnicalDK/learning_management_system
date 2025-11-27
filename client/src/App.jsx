import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./components/layout/RootLayout";
import StudentHomePage from "./pages/student/StudentHomePage";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import ProfilePage from "./pages/student/ProfilePage";
import TutorLayout from "./pages/tutor/TutorLayout";
import TutorDashboard from "./pages/tutor/courses/TutorDashboard";
import TutorCoursesTable from "./pages/tutor/courses/TutorCoursesTable";
import CreateCourse from "./pages/tutor/courses/CreateCourse";
import EditCourse from "./pages/tutor/courses/EditCourse";
// import ReactQuillEditor from "./components/ReactQuillEditor";
import CreateLecture from "./pages/tutor/lecture/CreateLecture";
import LecturesTable from "./pages/tutor/lecture/LecturesTable";
import EditLecture from "./pages/tutor/lecture/EditLecture";
import CourseDetails from "./pages/student/CourseDetails";
import PaymentConfirmation from "./pages/student/PaymentConfirmationPage";

function App() {
  return (
    <>
      <Routes>
        {/* ------------- student route------------ */}
        <Route path="/student" element={<RootLayout />}>
          <Route index element={<EnrolledCourses />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ----------Tutor  route------------------- */}
        <Route path="/tutor" element={<TutorLayout />}>
          <Route index element={<TutorDashboard />} />
          <Route path="courses-table" element={<TutorCoursesTable />} />
          <Route path="course/create-course" element={<CreateCourse />} />
          <Route path="course/:id/edit" element={<EditCourse />} />
          {/* -----------lectures---------------------------- */}
          <Route
            path="course/:courseId/:courseTitleParam/lectures"
            element={<LecturesTable />}
          />
          <Route
            path="course/:courseId/:courseTitleParam/lecture/create"
            element={<CreateLecture />}
          />
          <Route
            path="course/:courseId/:courseTitleParam/lecture/:lectureId"
            element={<EditLecture />}
          />
        </Route>

        {/* //---------------general route------------------- */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<StudentHomePage />} />
          <Route path="/:tab" element={<LoginPage />} />
          <Route path=":courseId/course-details" element={<CourseDetails />} />
          <Route
            path=":courseId/course-details/payment-confirmation"
            element={<PaymentConfirmation />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
