import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#3b0086",
    color: "white",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    bottom: 0,
    width: "100%",
  };

  return (
    <footer style={footerStyle}>
      <p>© The Turf Station. All rights reserved.</p>
      <p>Contact us: +91-9585332234</p>
    </footer>
  );
};

export default Footer;
