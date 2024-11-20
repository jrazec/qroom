import "./App.css";
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import HomePage from "./users/HomePage";
import Navbar from "./users/Navbar";
import RoomPage from "./users/RoomPage";
import RoomSearch from "./users/RoomSearch";
import RoomSearch1 from "./users/RoomSearch1";
import RoomSearch2 from "./users/RoomSearch2";
import SchedulePage from "./users/SchedulePage";
import LoginUser from "./users/LoginUser";
import Settings from "./users/Settings"; // Import Settings

const cur = {}; //current temp holder

const router = createBrowserRouter([
  {
    path: '/',
    element: <NotFound />,
  },
  {
    path: '/admin',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/admin',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/accounts',
        element: <Accounts />,
      },
      {
        path: '/admin/feedback',
        element: <Feedback />,
      },
      {
        path: '/admin/scheduling',
        element: <Scheduling />,
      },
      {
        path: '/admin/scheduling/sections',
        element: <Scheduling5 />,
      },
      {
        path: '/admin/scheduling/class',
        element: <Scheduling2 />,
      },
      {
        path: '/admin/scheduling/3',
        element: <Scheduling3 />,
      },
      {
        path: '/admin/scheduling/4',
        element: <Scheduling4 />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginUser />,
  },
  {
    path: '/user/home/:id',
    element: <HomePage />,
  },
  {
    path: '/user/login',
    element: <LoginUser />,
  },
  {
    path: '/user/room-search/:id',
    element: <RoomSearch2 />,
  },
  {
    path: '/user/room-search/:id/bldg/:bldgid',
    element: <RoomSearch2 />,
  },
  {
    path: '/user/room-search/:id/floor/:floorid',
    element: <RoomSearch1 />,
  },
  {
    path: '/user/room-search/:id/room/:roomid',
    element: <RoomSearch />,
  },
  {
    path: '/user/schedule/:id',
    element: <SchedulePage />,
  },
  {
    path: '/user/dashboard/:id',
    element: <HomePage />,
  },
  {
    path: '/user/feedback/:id',
    element: <FeedbackPage />,
  },
  {
    path: '/user/settings/:id', // Add this route for Settings
    element: <Settings />,
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
export { cur };
