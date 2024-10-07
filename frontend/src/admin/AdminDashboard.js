import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'

function AdminDashboard() {
    return (
      <>
        <header className="dashboard-header">
          <h1>Dashboard <span>Home</span></h1>
        </header>
        <section className="dashboard-grid">
          <div className="dashboard-box"></div>
          <div className="dashboard-box"></div>
          <div className="dashboard-box"></div>
          <div className="dashboard-box"></div>
          <div className="dashboard-box"></div>
        </section>
      </>
    );
  }


  export default AdminDashboard;