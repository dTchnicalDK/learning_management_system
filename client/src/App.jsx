import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./components/layout/RootLayout";
import StudentHomePage from "./pages/student/StudentHomePage";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import ProfilePage from "./pages/student/ProfilePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<StudentHomePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/student" element={<RootLayout />}>
          <Route index element={<EnrolledCourses />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
