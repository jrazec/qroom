import "./App.css";
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./admin/LayoutAdmin";
import AdminDashboard from './admin/AdminDashboard';
import Scheduling from './admin/Scheduling';
import Accounts from './admin/Accounts';
import Feedback from './admin/Feedback';
import Scheduling1 from "./admin/Scheduling1";
import SchedProf from "./admin/SchedProf";
import Scheduling3 from "./admin/Scheduling3";
import Scheduling4 from "./admin/Scheduling4";
import Scheduling5 from "./admin/Scheduling5";
import SchedSection from "./admin/SchedSection";
import SchedCalendar from "./admin/SchedCalendar";
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
import Settings from "./users/Settings";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute correctly

const cur = {}; // Current temporary holder

const router = createBrowserRouter([
  // Public Route
  {
    path: '/',
    element: <NotFound />,
  },
  // Admin Routes - No ProtectedRoute for now
  {
    path: '/admin',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/accounts', element: <Accounts /> },
      { path: '/admin/feedback', element: <Feedback /> },
      { path: '/admin/scheduling', element: <Scheduling /> },
      { path: '/admin/scheduling/sections', element: <Scheduling5 /> },
      { path: '/admin/scheduling/profselect', element: <SchedProf /> },
      { path: '/admin/scheduling/3', element: <Scheduling3 /> },
      { path: '/admin/scheduling/4', element: <Scheduling4 /> },
      { path: '/admin/scheduling/sectionselect', element: <SchedSection /> },
      { path: '/admin/scheduling/calendar', element: <SchedCalendar /> }
    ] // Removed ProtectedRoute from admin routes
  },
  {
    path: '/admin/login',
    element: <LoginUser />,
  },
  // User Routes
  {
    path: '/user/home/:id',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/user/login',
    element: <LoginUser />,
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
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/user/feedback/:id',
    element: <ProtectedRoute><FeedbackPage /></ProtectedRoute>,
  },
  {
    path: '/user/settings/:id',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
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
