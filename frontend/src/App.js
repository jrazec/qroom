import "./App.css";
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // Import Navigate for redirection

import Layout from "./admin/LayoutAdmin"; // Layout with sidebar for admins
import LoginAdmin from "./admin/LoginAdmin"; // Admin login page
import AdminDashboard from './admin/AdminDashboard';
import AdminFDashboard from './admin/AdminFDashboard';
import Scheduling from './admin/Scheduling';
import Accounts from './admin/Accounts';
import Feedback from './admin/Feedback';
import Scheduling1 from "./admin/Scheduling1";
import Scheduling3 from "./admin/Scheduling3";
import Scheduling4 from "./admin/Scheduling4";
import Scheduling5 from "./admin/Scheduling5";
import SchedProf from "./admin/SchedProf";
import SchedSection from "./admin/SchedSection";
import SchedCalendar from "./admin/SchedCalendar";
import SchedRoom from "./admin/SchedRoom";
import ManageSched from "./admin/ManageSched"; //temp
import NotFound from "./NotFound";
import FeedbackPage from "./users/FeedbackPage";
import HomePage from "./users/HomePage";
import Navbar from "./users/Navbar";
import RoomPage from "./users/RoomPage";
import RoomSearch from "./users/RoomSearch";
import RoomSearch1 from "./users/RoomSearch1";
import RoomSearch2 from "./users/RoomSearch2";
import SchedulePage from "./users/SchedulePage";
import LoginUser from "./users/LoginUser";  // User login page

import Settings from "./users/Settings";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute correctly
import ChatReport from './users/ChatReport';
import LoginToRoom from "./users/LoginToRoom";
import FacultyDashboard from './users/FacultyDashboard'; // Import the new component

import ResetPassword from './users/ResetPassword';

const cur = {}; // Current temporary holder

const router = createBrowserRouter([
  // Public Route: Root path should show the user login page
  {
    path: '/',
    element: <LoginUser />,  // Directly render LoginUser at the root
  },

  // Admin Routes - Protect these routes for authenticated admins
  {
    path: '/admin',
    element: <Navigate to="/admin/login" />,  // Redirect to admin login if not logged in
  },

  // Admin Login Route (Accessed when the user is not authenticated)
  {
    path: '/admin/login',
    element: <LoginAdmin />,  // Admin login page
  },

  // Admin Routes - Protect these routes for authenticated admins
  {
    path: '/admin',
    element: <ProtectedRoute isAdmin={true}><Layout /></ProtectedRoute>, // Protect the layout
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminFDashboard />,
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
        path: '/admin/scheduling/3', 
        element: <Scheduling3 />,
      },
      {
        path: '/admin/scheduling/4',
        element: <Scheduling4 />,
      },
      {
        path: '/admin/scheduling/profselect',
        element: <SchedProf />,
      },
      {
        path: '/admin/scheduling/sectionselect',
        element: <SchedSection />,
      },
      {
        path: '/admin/scheduling/calendar',
        element: <SchedCalendar />,
      },
      {
        path: '/admin/scheduling/roomselect',
        element: <SchedRoom />,
      },
      { path: '/admin/scheduling/roomselect', element: <SchedRoom /> },
      { path: '/admin/scheduling/managesched', element: <ManageSched /> }

      
    ],
  },

  // User Routes - Protected Routes for users
  {
    path: '/user/home/:id',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/user/login',
    element: <LoginUser />,  // User login page
  },
  {
    path: '/user/room/:roomid',
    element: <LoginToRoom />,
  },
  {
    path: '/user/room-search/:id',
    element: <ProtectedRoute><RoomSearch2 /></ProtectedRoute>,
  },
  {
    path: '/user/room-search/:id/bldg/:bldgid',
    element: <ProtectedRoute><RoomSearch2 /></ProtectedRoute>,
  },
  {
    path: '/user/room-search/:id/floor/:floorid',
    element: <ProtectedRoute><RoomSearch1 /></ProtectedRoute>,
  },
  {
    path: '/user/room-search/:id/room/:roomid',
    element: <ProtectedRoute><RoomSearch /></ProtectedRoute>,
  },
  {
    path: '/user/schedule/:id',
    element: <ProtectedRoute><SchedulePage /></ProtectedRoute>,
  },
  {
    path: '/user/dashboard/:id',
    element: <ProtectedRoute><FacultyDashboard /></ProtectedRoute>,
  },
  {
    path: '/user/feedback/:id',
    element: <ProtectedRoute><FeedbackPage /></ProtectedRoute>,
  },
  {
    path: '/user/settings/:id',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/chat-report/:id',
    element: <ProtectedRoute><ChatReport /></ProtectedRoute>,
  },
  // Reset Password Route
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,  // Reset Password page
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
