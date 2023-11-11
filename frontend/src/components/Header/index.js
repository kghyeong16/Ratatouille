import React from "react";
import logo from "../../assets/logo/long-logo.png";
import "./styles.css";
import BasicMenu from "./ProfileMenu";
import { NavLink } from "react-router-dom";


function Header() {
  return (
    <div className="header">
      <div className="navbar">
        <NavLink to={"/"}>
          <img src={logo} alt="logo" className="navbar-logo" />
        </NavLink>
        <div className="profile-container">
    
          <div className="profile-div">
            <BasicMenu />
          </div>
        </div>
        
        

      </div>
    </div>
    
  );
}

export default Header;
