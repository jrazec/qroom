import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './../AdminFDashboard.module.css';


const OccupationLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            axios.post(`${process.env.REACT_APP_LOCALHOST}/admin/occupation-logs`, {
            includeAll: false
            })
            .then(response => {
                setLogs(response.data.results);
            })
            .catch(error => {
                console.error('Error fetching occupation logs:', error);
            });
        };

        fetchData(); // Initial fetch

        const interval = setInterval(fetchData, 1000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div>
            <h4 className={styles.occuTitle}>Occupation Logs</h4>
            {(logs === undefined || logs.length === 0) ? (
                <p style={{ textAlign: 'center', color: '#999', margin: 0 }}>No logs found this day.</p>
            ) : (
                <div className={styles.occuTableContainer}>
                    <table className={styles.occuTable}>
                        <thead>
                            <tr>
                                <th className={styles.occuTh}>Occupation ID</th>
                                <th className={styles.occuTh}>Room ID</th>
                                <th className={styles.occuTh}>Occupation Start</th>
                                <th className={styles.occuTh}>Occupation End</th>
                                <th className={styles.occuTh}>User Name</th>
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