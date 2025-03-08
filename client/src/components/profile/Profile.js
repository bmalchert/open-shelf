// client/src/components/profile/Profile.js
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, changePassword, loading, error, clearError } = useContext(AuthContext);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    avatar: '',
    showEmail: false,
    showLocation: true,
    showLibrary: true
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Form feedback state
  const [profileFeedback, setProfileFeedback] = useState({ message: '', isError: false });
  const [passwordFeedback, setPasswordFeedback] = useState({ message: '', isError: false });
  
  // Load user data into form when available
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        location: user.location || '',
        avatar: user.avatar || '',
        showEmail: user.privacySettings?.showEmail || false,
        showLocation: user.privacySettings?.showLocation || true,
        showLibrary: user.privacySettings?.showLibrary || true
      });
    }
    
    // Handle errors from context
    if (error) {
      setProfileFeedback({ message: error, isError: true });
      clearError();
    }
  }, [user, error, clearError]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous feedback
    setProfileFeedback({ message: '', isError: false });
    
    // Prepare data for API
    const updatedProfile = {
      name: profileData.name,
      location: profileData.location,
      avatar: profileData.avatar,
      privacySettings: {
        showEmail: profileData.showEmail,
        showLocation: profileData.showLocation,
        showLibrary: profileData.showLibrary
      }
    };
    
    // Submit update
    const success = await updateProfile(updatedProfile);
    
    // Set feedback
    if (success) {
      setProfileFeedback({ 
        message: 'Profile updated successfully!', 
        isError: false 
      });
    } else {
      setProfileFeedback({ 
        message: error || 'Failed to update profile. Please try again.', 
        isError: true 
      });
    }
  };
  
  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous feedback
    setPasswordFeedback({ message: '', isError: false });
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({ 
        message: 'New passwords do not match.', 
        isError: true 
      });
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordFeedback({ 
        message: 'Password must be at least 6 characters.', 
        isError: true 
      });
      return;
    }
    
    // Submit password change
    const success = await changePassword(
      passwordData.currentPassword, 
      passwordData.newPassword
    );
    
    // Set feedback and reset form if successful
    if (success) {
      setPasswordFeedback({ 
        message: 'Password changed successfully!', 
        isError: false 
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setPasswordFeedback({ 
        message: error || 'Failed to change password. Please try again.', 
        isError: true 
      });
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      <div className="profile-grid">
        {/* Profile Information Form */}
        <div className="profile-section">
          <h2>Profile Information</h2>
          
          {profileFeedback.message && (
            <div className={`alert ${profileFeedback.isError ? 'alert-danger' : 'alert-success'}`}>
              {profileFeedback.message}
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleProfileChange}
                placeholder="City, Country"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={profileData.avatar}
                onChange={handleProfileChange}
                placeholder="https://example.com/avatar.jpg"
              />
              {profileData.avatar && (
                <div className="avatar-preview">
                  <img 
                    src={profileData.avatar} 
                    alt="Avatar preview" 
                    onError={(e) => e.target.src = '/default-avatar.png'}
                  />
                </div>
              )}
            </div>
            
            <h3>Privacy Settings</h3>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="showEmail"
                name="showEmail"
                checked={profileData.showEmail}
                onChange={handleProfileChange}
              />
              <label htmlFor="showEmail">Show email to other users</label>
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="showLocation"
                name="showLocation"
                checked={profileData.showLocation}
                onChange={handleProfileChange}
              />
              <label htmlFor="showLocation">Show location to other users</label>
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="showLibrary"
                name="showLibrary"
                checked={profileData.showLibrary}
                onChange={handleProfileChange}
              />
              <label htmlFor="showLibrary">Make my book library public</label>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
        
        {/* Change Password Form */}
        <div className="profile-section">
          <h2>Change Password</h2>
          
          {passwordFeedback.message && (
            <div className={`alert ${passwordFeedback.isError ? 'alert-danger' : 'alert-success'}`}>
              {passwordFeedback.message}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;