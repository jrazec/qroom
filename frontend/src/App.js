import "./App.css";
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';
import AdminDashboard from './admin/AdminDashboard';
import Scheduling from './admin/Scheduling';
import Layout from "./admin/LayoutAdmin";


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
     
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="scheduling" element={<Scheduling />} />

      </Route>
    </Routes>
  </BrowserRouter>
   
  );
}

export default App;