import "./App.css";
import NavBar from "./components/NavBar";
import { Button } from "./components/ui/button";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex min-h-svh flex-col items-center justify-center">
        <LoginPage />
      </div>
    </>
  );
}

export default App;
