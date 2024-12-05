import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';

// Register chart components
ChartJS.register(
  ArcElement, // for Doughnut/Pie charts
  Tooltip,
  Legend,
  CategoryScale, // for X-axis labels
  LinearScale,   // for Y-axis labels
  PointElement,  // for line chart points
  LineElement,   // for line chart lines
  BarElement     // for bar charts
);

const DonutChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [kpiStatus, setKpiStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/admin/donut`, {
          "month": "all"      
        });
        const raw = response.data.results[0];
        const roomUtilization = raw.room_utilization_percentage;
        const data = [
          100 - roomUtilization,
          roomUtilization,
        ];

        // Determine KPI status
        let status = '';
        if (roomUtilization >= 75) {
          status = 'Good';
        } else if (roomUtilization >= 50) {
          status = 'Average';
        } else {
          status = 'Poor';
        }

        setChartData({
          labels: [ 'Not Utilized','Room Utilization'],
          datasets: [
            {
              data,
              backgroundColor: ['#ffcccc', '#800000'],
              hoverBackgroundColor: ['#ff9999', '#660000'],
            },
          ],
        });
        setKpiStatus(status);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);
  const fetchDataForMonth = async (month) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/admin/donut`, {
        "month": month      
      });
      const raw = response.data.results[0];
      const roomUtilization = raw.room_utilization_percentage;
      const data = [
        100 - roomUtilization,
        roomUtilization,
      ];

      // Determine KPI status
      let status = '';
      if (roomUtilization >= 75) {
        status = 'Good';
      } else if (roomUtilization >= 50) {
        status = 'Average';
      } else {
        status = 'Poor';
      }
      if (roomUtilization === null) {
        status = 'No Data';
      }

      setChartData({
        labels: [ 'Not Utilized','Room Utilization'],
        datasets: [
          {
            data,
            backgroundColor: ['#ffcccc', '#800000'],
            hoverBackgroundColor: ['#ff9999', '#660000'],
          },
        ],
      });
      setKpiStatus(status);
    } catch (error) {
      console.error('Error fetching the data', error);
    }
  };
  return (
    <div style={{ height: '15rem', margin: '0', position: 'relative' }}>
      <select 
        onChange={(e) => {
          const selectedMonth = e.target.value;
          // Fetch data for the selected month
          fetchDataForMonth(selectedMonth);
        }}
        style={{ 
          position: 'absolute', 
          top: '0', 
          right: '0', 
          margin: '1rem', 
          backgroundColor: 'maroon', 
          color: 'white' 
        }}
      >
        <option value="all" selected>All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <Doughnut 
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        }}
      />
      <div style={{ 
        position: 'absolute', 
        top: '45%', 
        left: '50%', 
        fontSize: '1rem',
        transform: 'translate(-50%, -50%)', 
        textAlign: 'center' 
      }}>
        <h3>{kpiStatus}</h3>
      </div>
    </div>
  );
};

export default DonutChart;
