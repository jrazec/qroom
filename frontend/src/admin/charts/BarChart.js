import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {

  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ filter }) => {
  const [originalData,setOriginalData] = useState([
{    room_name: "Computer Laboratory 2",
    total_usage_hours: "61.5689"},
    {    room_name: "Computer Laboratory 2",
      total_usage_hours: "61.5689"},
      {    room_name: "Computer Laboratory 2",
        total_usage_hours: "61.5689"},
        {    room_name: "Computer Laboratory 2",
          total_usage_hours: "61.5689"},
          {    room_name: "Computer Laboratory 2",
            total_usage_hours: "61.5689"}
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/admin/bar-chart`, {
          month: 1
        });
        console.log('Bar chart data:', response.data);
        setOriginalData(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sortedData = [...originalData].sort((a, b) => {
    return filter === 'Most Utilized Room' ? b.total_usage_hours - a.total_usage_hours : a.total_usage_hours - b.total_usage_hours;
  });

  const topFiveData = sortedData.slice(0, 5);

  const barData = {
    labels: topFiveData.map((data) => data.room_name),
    datasets: [
      {
        label: 'Usage %',
        data: topFiveData.map((data) => data.total_usage_hours),
        backgroundColor: '#ff9999',
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        top: 20,  // Add padding on the top if required
      },
    },
  };

  return (
    <div className="chart-container"> {/* Add a fixed height */}
      <Bar data={barData} options={barOptions} />
    </div>
  );
};

export default BarChart;
