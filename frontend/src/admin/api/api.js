// api.js


export const fetchGroupAccounts = async () => {
    const response = await fetch(`http://${process.env.REACT_APP_LOCALHOST}/api`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

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