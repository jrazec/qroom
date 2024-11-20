import React from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
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

const DonutChart = () => {
  const data = {
    labels: ['Utilized', 'Not Utilized'],
    datasets: [
      {
        data: [65, 35], // Utilized and Not Utilized percentages
        backgroundColor: ['#ffcccc', '#800000'],
        hoverBackgroundColor: ['#ff9999', '#660000'],
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
};

export default DonutChart;
