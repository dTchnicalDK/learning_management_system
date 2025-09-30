import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/ThemeProvider";
// import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
