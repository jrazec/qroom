import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const QRCodeGrid = ({ qrCodes }) => {
  return (
    <Container fluid style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
        }}
      >
        <Row style={{ maxWidth: "800px" }}>
          {qrCodes.map((qrCode, index) => (
            <Col
              key={index}
              xs={4}
              className="d-flex justify-content-center align-items-center"
              style={{
                border: "1px solid black",
                padding: "10px",
                height: "200px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img src={qrCode.image} alt={`QR code ${index + 1}`} width="100" />
                <p style={{ marginTop: "10px" }}>{qrCode.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default QRCodeGrid;

// Sample usage example for App.js:
// import React from "react";
// import QRCodeGrid from "./QRCodeGrid";
//
// const qrCodes = [
//   { image: "path/to/qr1.png", label: "Computer Laboratory 1" },
//   { image: "path/to/qr2.png", label: "Computer Laboratory 2" },
//   { image: "path/to/qr3.png", label: "VMB 304" },
//   { image: "path/to/qr4.png", label: "Computer Laboratory 4" },
//   { image: "path/to/qr5.png", label: "Computer Laboratory 5" },
//   { image: "path/to/qr6.png", label: "VMB 300/ SSC Office/ Publication" },
//   { image: "path/to/qr7.png", label: "Computer Laboratory 9" },
//   { image: "path/to/qr8.png", label: "Computer Laboratory 6" },
//   { image: "path/to/qr9.png", label: "VMB 400/ SSC Office/" },
// ];
//
// function App() {
//   return (
//     <div className="App">
//       <QRCodeGrid qrCodes={qrCodes} />
//     </div>
//   );
// }
//
// export default App;

// This code uses React and Bootstrap to create a 3x3 grid for QR codes, fitting well into A4/letter paper size for printing purposes. Adjust QR image sizes and styles to your liking if needed.
