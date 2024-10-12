// api.js


export const fetchGroupAccounts = async () => {
    const response = await fetch(`http://${process.env.REACT_APP_LOCALHOST}/api/accounts`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};
export const updateData = async (dataToChange) =>{
    fetch(`http://${process.env.REACT_APP_LOCALHOST}/api/accounts`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToChange), // Convert the object to JSON
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
export const sendData = async (dataToSend) =>{
    fetch(`http://${process.env.REACT_APP_LOCALHOST}/api/accounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Convert the object to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export const deleteData = async (dataToChange) =>{
    fetch(`http://${process.env.REACT_APP_LOCALHOST}/api/accounts`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToChange), // Convert the object to JSON
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}