import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AcceptReserve = () => {
    const [showModal, setShowModal] = useState(false);
    const [reqId, setReqId] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        fetch('user/room-reqs')
            .then(response => response.json())
            .then(data => {
                if (data && data.reqId) {
                    setReqId(data.reqId);
                    setUserName(data.user_name);
                } else {
                    setShowModal(false);
                    document.querySelector('button').style.display = 'none';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleAccept = () => {
        fetch('/user/room-reqs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'accepted', reqId: reqId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        handleClose();
    };

    const handleReject = () => {
        fetch('/user/room-reqs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejected', reqId: reqId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} style={{ display: showModal ? 'none' : 'block' }}>
                Room Request
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Accept or Reject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you want to accept or reject the reservation?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReject}>
                        Reject
                    </Button>
                    <Button variant="primary" onClick={handleAccept}>
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AcceptReserve;
