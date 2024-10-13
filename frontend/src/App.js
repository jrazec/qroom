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
import NotFound from "./NotFound";

import LoginUser from "./users/LoginUser"

const cur = {}; //current temp holder

const router = createBrowserRouter([
  {
    path: '/admin',
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
    ]
  }, 
  {
    path: '/user',
    element: <LoginUser page={"Main Dashboard"} />,
  },
  {
    path: '/user/login',
    element: <LoginUser page={"Login"}/>,
  },
  {
    path: '/user/room-search',
    element: <LoginUser page={"Room Search"}/>,
  },
  {
    path: '/user/room-search/bldg/:bldgid',
    element: <LoginUser page={"BLDG Search"}/>,
  },
  {
    path: '/user/room-search/floor/:floorid',
    element: <LoginUser page={"FLOOR SEARCH"}/>,
  },
  {
    path: '/user/room-search/room/:roomid',
    element: <LoginUser page={"ROOM SEARCH"}/>,
  },

  {
    path: '/user/schedule',
    element: <LoginUser page={"Schedule"}/>,
  },
  {
    path: '/user/dashboard',
    element: <LoginUser page={"DASHBOARD"} />
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