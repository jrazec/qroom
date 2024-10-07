import "./App.css";
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import Layout from "./admin/LayoutAdmin";

import AdminDashboard from './admin/AdminDashboard';
import Scheduling from './admin/Scheduling';
import Accounts from './admin/Accounts';
import Feedback from './admin/Feedback';
import NotFound from "./NotFound";

import HomePage from "./users/HomePage";
import LoginUser from "./users/LoginUser";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement : <NotFound />,
    children : [
      {
        path: '/',
        element: <AdminDashboard />,
      },
      {
        path: '/accounts',
        element: <Accounts />
      },
      {
        path: '/feedback',
        element: <Feedback />
      },
      {
        path: '/scheduling',
        element: <Scheduling />
      },
    ]
  }

]);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up a polling interval to check for changes in the JSON file
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Adjust the interval as needed

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
     
    // <React.StrictMode>
    //   <RouterProvider router={router} />
    // </React.StrictMode>

    <LoginUser/>
   
  );
}

export default App;