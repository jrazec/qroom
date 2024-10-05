import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>      {data ? (
        <p>Data from Node.js: {data.message}</p>
      ) : (
        <p>Loading data...</p>
      )}</p>
      </header>
    </div>
  );
}

export default App;