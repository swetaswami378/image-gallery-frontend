import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import Upload from './upload';
import Gallery from './galary';
import { useAuth } from '../auth/useAuth';
import { showSuccess } from '../components/toast';
import '../styles/home.css';

export default function Home() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [updateGalleryImages, setUpdateGallery] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    showSuccess("Successfully logged out");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Home</h1>
        <div className="header-actions">
          <div className="profile-menu-container" ref={menuRef}>
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <FaUser className="profile-icon" />
              <span className="username">{user}</span>
            </button>
            
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <FaUser className="profile-icon" />
                  <div className="user-info">
                <span className="username">{user}</span>
                  </div>
                </div>
                <hr className="profile-menu-divider" />
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt className="logout-icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="home-content">
        <section className="upload-section">
          <Upload  updateGallery={setUpdateGallery} />
        </section>
        
        <section className="gallery-section">
          <Gallery updateImages={updateGalleryImages} updateGallery={setUpdateGallery} />
        </section>
      </main>
    </div>
  );
}
