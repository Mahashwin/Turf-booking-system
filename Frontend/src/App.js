import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Booking from "./components/Booking";
import Feedback from "./components/Feedback";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConfirmationPage from "./components/ComfirmationPage";

const App = () => {
  // Styles for the app container and main content
  const appContainerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const mainContentStyle = {
    flex: 1,
    marginTop: "20px",
  };

  return (
    <div style={appContainerStyle}>
      <Router> {/* Wrap entire app in Router */}
        <Navbar /> {/* Navbar component */}
        
        <div style={mainContentStyle}>
          {/* Define routes */}
          <Routes>
            <Route path="/" element={<Login />} /> {/* Default route set to Login */}
            <Route path="/booking" element={<Booking />} /> {/* Booking route */}
            <Route path="/feedback" element={<Feedback />} /> {/* Feedback route */}
            <Route path="/admin" element={<Admin />} /> {/* Admin route */}
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </div>
        
        {/* Uncomment Footer if needed */}
        {/* <Footer /> */}
      </Router>
    </div>
  );
};

export default App;
