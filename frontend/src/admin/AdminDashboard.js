import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'

function AdminDashboard() {
    return (
      <>
         <header className="dashboard-header">
        <h1>Dashboard <span>Home</span></h1>
        </header>
        <section className="dashboard-grid">
          <div className="grid-item large"></div>
          <div className="grid-item small"></div>
          <div className="grid-item medium"></div>
          <div className="grid-item large"></div>
          <div className="grid-item medium"></div>
        </section>
      </>
    );
  }


  export default AdminDashboard;