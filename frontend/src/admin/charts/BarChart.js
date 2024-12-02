import React from 'react';
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
  const originalData = [
    { year: 'VMB 305', value: 100 },
    { year: 'VMB 404', value: 200 },
    { year: 'GZB 305', value: 300 },
    { year: 'GZB 304', value: 400 },
    { year: 'Computer Laboratory 2', value: 500 },
    { year: 'Computer Laboratory 1', value: 600 },
    { year: 'VMB 404', value: 500 },
    { year: 'GZB 305', value: 700 },
    { year: 'GZB 304', value: 900 },
    { year: 'Computer Laboratory 2', value: 1000 },
    { year: 'Computer Laboratory 1', value: 1200 },
  ];

  const sortedData = [...originalData].sort((a, b) => {
    return filter === 'Most Utilized Room' ? b.value - a.value : a.value - b.value;
  });

  const topFiveData = sortedData.slice(0, 5);

  const barData = {
    labels: topFiveData.map((data) => data.year),
    datasets: [
      {
        label: 'Usage %',
        data: topFiveData.map((data) => data.value),
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
  };

  return (
    <div className='d-flex align-items-center'>
      <Bar data={barData} options={barOptions} />
    </div>
  );
};

export default BarChart;
