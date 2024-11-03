// frontend/users/Settings.js
import React from 'react';
import Navbar from './Navbar';
import ProfilePicture from './ProfilePicture';
import ChangePassword from './ChangePassword';
import { useParams } from 'react-router-dom';

function Settings() {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Settings</h1>
        <ProfilePicture userId={id} />
        <ChangePassword userId={id} />
      </div>
    </div>
  );
}

export default Settings;
