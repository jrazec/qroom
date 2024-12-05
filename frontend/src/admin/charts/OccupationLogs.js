import React, { useState, useEffect } from 'react';
import axios from 'axios';


const OccupationLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_LOCALHOST}/admin/occupation-logs`, {
            includeAll: false
        })
            .then(response => {
                setLogs(response.data.results);
            })
            .catch(error => {
                console.error('Error fetching occupation logs:', error);
            });
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', color: '#333' }}>
            <h2 style={{ textAlign: 'center', color: '#4a4a4a', margin: 0 }}>Occupation Logs</h2>
            {(logs === undefined || logs.length === 0) ? (
                <p style={{ textAlign: 'center', color: '#999', margin: 0 }}>No logs found this day.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', padding: 0 }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', color: '#4a4a4a', padding: 0, margin: 0 }}>Occupation ID</th>
                                <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', color: '#4a4a4a', padding: 0, margin: 0 }}>Room ID</th>
                                <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', color: '#4a4a4a', padding: 0, margin: 0 }}>Occupation Start</th>
                                <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', color: '#4a4a4a', padding: 0, margin: 0 }}>Occupation End</th>
                                <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', color: '#4a4a4a', padding: 0, margin: 0 }}>User Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff', padding: 0, margin: 0 }}>
                                    <td style={{ borderBottom: '1px solid #ddd', color: '#333', padding: 0, margin: 0 }}>{log.occupation_id}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', color: '#333', padding: 0, margin: 0 }}>{log.room_id}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', color: '#333', padding: 0, margin: 0 }}>{new Date(log.occupation_start).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', color: '#333', padding: 0, margin: 0 }}>{log.occupation_end ? new Date(log.occupation_end).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : 'Waiting'}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', color: '#333', padding: 0, margin: 0 }}>{log.user_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


export default OccupationLogs;