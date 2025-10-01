import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import HeroSection from "./pages/student/HeroSection";
import RootLayout from "./components/layout/RootLayout";
import Course from "./pages/student/Course";
import StudentHomePage from "./pages/student/StudentHomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<StudentHomePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
