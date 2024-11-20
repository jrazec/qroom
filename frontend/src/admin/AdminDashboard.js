import React from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import DonutChart from './charts/DonutChart';
import PieChart from './charts/PieChart';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';

const AdminDashboard = () => {
  const [usageFilter, setUsageFilter] = React.useState("Most Utilized Room");

  return (
    <Container fluid className="d-flex flex-column p-4" >
      {/* Header */}
      <Row className="mb-4" >
        <Col>
          <h1 className="text-danger font-weight-bold text-left">
            Dashboard <span className="text-muted">Home</span>
          </h1>
        </Col>
      </Row>

      {/* First Row (Charts & Summary) */}
      <Row className="mb-4">
        <Col xs={12} md={5} className="d-flex flex-column justify-content-center align-items-center" style={{ width: '40%',height:"40%"}}>
          <div className="w-100 card p-4">
            <DonutChart />
            <h4 className="text-center mt-3">Overall Room Utilization</h4>
          </div>
        </Col>
        <Col xs={6} md={2} className="d-flex flex-column justify-content-around align-items-center" style={{ width: '20%' }}>
          <div className="card p-4 text-center mb-4 w-100">
            <h4>Total Instructors</h4>
            <h2 className="text-danger font-weight-bold">12</h2>
          </div>
          <div className="card p-4 text-center w-100">
            <h4>Total Students</h4>
            <h2 className="text-danger font-weight-bold">6</h2>
          </div>
        </Col>
        <Col xs={12} md={5} className="d-flex flex-column justify-content-center align-items-center" style={{ width: '40%' }}>
          <div className="w-100 card p-4">
            <PieChart />
            <h4 className="text-center mt-3">Room Occupancy</h4>
          </div>
        </Col>
      </Row>

      {/* Second Row (Charts) */}
      <Row className="mb-4">
        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
          <div className="w-100 card p-4">
            <LineChart />
            <h4 className="text-center mt-3">Room Utilization (Week)</h4>
          </div>
        </Col>
        <Col xs={12} md={6} className="d-flex flex-column align-items-center">
          <Dropdown className="mb-3 align-self-end">
            <Dropdown.Toggle variant="danger" id="dropdown-basic">
              {usageFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setUsageFilter('Most Utilized Room')}>Most Utilized Room</Dropdown.Item>
              <Dropdown.Item onClick={() => setUsageFilter('Least Utilized Room')}>Least Utilized Room</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="w-100 card p-4 h-100">
            <BarChart filter={usageFilter} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
