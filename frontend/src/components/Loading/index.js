import React from "react";
import './styles.css'
import transparentLogo from '../../assets/logo/trans-logo.png'

export default function OverlayLoading() {
  return (
    <div className="overlay">
      <div className="loading-box">
        <img src={transparentLogo} alt="loading" />
        <p className="loading-text">Loading</p>
      </div>
    </div>
  )
}