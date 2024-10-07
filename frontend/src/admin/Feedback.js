import React from 'react';
import './Feedback.css'; // Custom styles for additional customization

const Feedback = () => {
  // return (
  //   <div className="dashboard-container">
  //     <div className="dashboard-header text-center mb-4">
  //       <h1 className="dashboard-title">
  //         Dashboard <span className="sub-title">Feedback</span>
  //       </h1>
  //     </div>

  //     <h3 className="room-title">Room</h3>
      
  //     <div className="feedback-sections container">
  //       <div className="row">
  //         {/* Rooms and Status Column */}
  //         <div className="col-lg-6 col-md-6">
  //           <div className="table-container">
  //             <table className="table table-borderless">
  //               <thead>
  //                 <tr>
  //                   <th>Rooms</th>
  //                   <th>Status</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {/* Dynamic rows can be added using .map() in case data is coming from a backend */}
  //                 {[...Array(10)].map((_, i) => (
  //                   <tr key={i}>
  //                     <td>
  //                       <input type="checkbox" className="room-checkbox" />
  //                     </td>
  //                     <td>Approved</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>

  //         {/* Reports Column */}
  //         <div className="col-lg-6 col-md-6">
  //           <div className="table-container">
  //             <table className="table table-borderless">
  //               <thead>
  //                 <tr>
  //                   <th>Reports</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {/* Dynamic rows */}
  //                 {[...Array(10)].map((_, i) => (
  //                   <tr key={i}>
  //                     <td className="report-cell">&nbsp;</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Feedback;
