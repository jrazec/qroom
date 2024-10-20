import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RoomCss from './RoomPage.module.css';
import { useParams } from 'react-router-dom';

function RoomPage() {
  const {id} = useParams();

  return (
    <div className={RoomCss.app}>
    <Navbar id={id}/>
    <main className={RoomCss.mainContent}>

        <div className={RoomCss.socialIcons}>
        <a href="#" className={RoomCss.socialIcon}>
          <i className="fa fa-facebook"></i>
        </a>
        <a href="#" className={RoomCss.socialIcon}>
          <i className="fa fa-envelope"></i>
        </a>
        <a href="#" className={RoomCss.socialIcon}>
          <i className="fa fa-twitter"></i>
        </a>
      </div>
    </main>
  </div>
  );
}

export default RoomPage;
