import React from 'react';
import { Doughnut, Line, Bar, Pie } from 'react-chartjs-2';
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


// Register the necessary elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Occupied', 'Scheduled but Vacant', 'Vacant'],
    datasets: [
      {
        data: [20, 10, 55], // Replace with dynamic data if needed
        backgroundColor: ['#800000', '#ff6666', '#ffcccc'],
        hoverBackgroundColor: ['#660000', '#ff3333', '#ff9999'],
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />

    </div>
  );
};

export default PieChart;
