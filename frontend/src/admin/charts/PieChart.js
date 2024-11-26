import React, { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register chart components
ChartJS.register(
  ArcElement, // for Doughnut/Pie charts
  Tooltip,
  Legend,
  CategoryScale, // for X-axis labels
  LinearScale   // for Y-axis labels
);

// Sample room data by status
const roomData = {
  occupied: ['Room A', 'Room D'],
  scheduledButVacant: ['Room B', 'Room E'],
  vacant: ['Room C', 'Room F', 'Room G']
};

const PieChart = () => {
  // Use a ref to access the chart instance
  const chartRef = useRef(null);

  const data = {
    labels: ['Occupied', 'Scheduled but Vacant', 'Vacant'],
    datasets: [
      {
        data: [roomData.occupied.length, roomData.scheduledButVacant.length, roomData.vacant.length], // Dynamic data from roomData
        backgroundColor: ['#800000', '#ff6666', '#ffcccc'],
        hoverBackgroundColor: ['#660000', '#ff3333', '#ff9999'],
      },
    ],
  };

  // Handle click event
  const handleClick = (event) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const label = data.labels[clickedIndex];

        // Retrieve the corresponding rooms based on the clicked segment
        let rooms = [];
        if (label === 'Occupied') {
          rooms = roomData.occupied;
        } else if (label === 'Scheduled but Vacant') {
          rooms = roomData.scheduledButVacant;
        } else if (label === 'Vacant') {
          rooms = roomData.vacant;
        }

        // Display room details
        alert(`Rooms in status "${label}":\n${rooms.join(', ')}`);
      }
    }
  };

  return (
    <div style={{ height: '13rem', margin: '0'}}>
      <Pie
        ref={chartRef}
        data={data}
        onClick={handleClick}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const status = tooltipItem.label;
                  const count = tooltipItem.raw;
                  return `${status}: ${count} rooms`;
                },
              },
            },
          },
          onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
              event.native.target.style.cursor = 'pointer';
            } else {
              event.native.target.style.cursor = 'default';
            }
          },
        }}
      />
    </div>
  );
};

export default PieChart;
