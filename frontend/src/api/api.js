// api.js

export const getAccount = async () => {
    const response = await fetch(`http://${process.env.REACT_APP_LOCALHOST}/api/accounts`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};
export const updateAccount = async (dataToChange) =>{
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
export const createAccount = async (dataToSend) =>{
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

export const deleteAccount = async (dataToChange) =>{
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

export const checkCreds = async ({ user_name, password }) => {
    try {
        const response = await fetch(`http://${process.env.REACT_APP_LOCALHOST}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name, password })
        });
        return response.json();
    } catch (error) {
        console.error('Error in checkCreds:', error);
        throw error; // Propagate error for further handling
    }
};


export const getUserSchedule = async (uName) => {
    try {
        const response = await fetch(`http://${process.env.REACT_APP_LOCALHOST}/user/schedule`, {
            method: 'POST', // Change to POST
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ uName }) // Pass the username in the body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error in getUserSchedule:', error);
        throw error; // Propagate error for further handling
    }
};

export const getRoom = async (rId) => {
    try {

        const url = new URL(`http://${process.env.REACT_APP_LOCALHOST}/user/rooms`);
        url.searchParams.append('roomid', rId);

        const response = await fetch(url, {
            method: 'GET', // Change to POST
            headers: { 
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error in getUserSchedule:', error);
        throw error; // Propagate error for further handling
    }
};