import "./App.css";
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import axios from 'axios';

import Layout from "./admin/LayoutAdmin";

import AdminDashboard from './admin/AdminDashboard';
import Scheduling from './admin/Scheduling';
import Accounts from './admin/Accounts';
import Feedback from './admin/Feedback';
import Scheduling1 from "./admin/Scheduling1";
import Scheduling2 from "./admin/Scheduling2";
import Scheduling3 from "./admin/Scheduling3";
import Scheduling4 from "./admin/Scheduling4";
import Scheduling5 from "./admin/Scheduling5";

import NotFound from "./NotFound";

import FeedbackPage from "./users/FeedbackPage";
import HomePage from "./users/HomePage"
import Navbar from "./users/Navbar";
import RoomPage from "./users/RoomPage"
import SchedulePage from "./users/SchedulePage"
import LoginUser from "./users/LoginUser"

const cur = {}; //current temp holder

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement : <NotFound />,
    children : [
      {
        path: '/admin',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/accounts',
        element: <Accounts />
      },
      {
        path: '/admin/feedback',
        element: <Feedback />
      },
      {
        path: '/admin/scheduling',
        element: <Scheduling />
      },
      {
        path: '/admin/scheduling/1',
        element: <Scheduling1 />
      },
      {
        path: '/admin/scheduling/2',
        element: <Scheduling2 />
      },
      {
        path: '/admin/scheduling/3',
        element: <Scheduling3 />
      },
      {
        path: '/admin/scheduling/4',
        element: <Scheduling4 />
      },
      {
        path: '/admin/scheduling/5',
        element: <Scheduling5 />
      },
    ]
  }, 
  {
    path: '/user/home/:id',
    element: <HomePage page={"Main Dashboard"} />,
  },
  {
    path: '/user/login',
    element: <LoginUser />,
  },
  {
    path: '/user/room-search/:id',
    element: <RoomPage />,
  },
  {
    path: '/user/room-search/:id/bldg/:bldgid',
    element: <RoomPage />,
  },
  {
    path: '/user/room-search/:id/floor/:floorid',
    element: <RoomPage />,
  },
  {
    path: '/user/room-search/:id/room/:roomid',
    element: <RoomPage />,
  },
  {
    path: '/user/schedule/:id',
    element: <SchedulePage />,
  },
  {
    path: '/user/dashboard/:id',
    element: <HomePage />
  },
  {
    path: '/user/feedback/:id',
    element: <FeedbackPage />
  },
  
  

]);

function App() {

  return (
     
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>

   
  );
}

export default App;
export {cur };