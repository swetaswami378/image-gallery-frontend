import React from 'react';
import '../styles/loader.css';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="spinner"></div>
        <p>Please wait...</p>
      </div>
    </div>
  );
}