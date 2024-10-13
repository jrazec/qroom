import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';


function SchedulePage() {

  return (
    <div className={ScheduleCss.app}>
      <Navbar />
      <main className={ScheduleCss.mainContent}>

          <div className={ScheduleCss.socialIcons}>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
