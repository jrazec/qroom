import React from 'react';
import { Line } from 'react-chartjs-2';
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

const LineChart = () => {

  const data = {
    labels: ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'],
    datasets: [
      {
        label: 'Room Utilization (%)',
        data: [10, 55, 15, 20, 55, 15, 10], // Replace with dynamic data if needed
        fill: false,
        borderColor: '#ff6666',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line 
        data={data}
        options={{
          maintainAspectRatio: false,
        }} />
    </div>
  );
};

export default LineChart;
