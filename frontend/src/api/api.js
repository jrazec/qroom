// api.js
import axios from "axios";

// Example of an API call with the token included
export const getAccount = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Check if the token is correctly added
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  
  // Update other API calls in a similar way to include the token
  
export const updateAccount = async (dataToChange) =>{
    fetch(`${process.env.REACT_APP_LOCALHOST}/admin/accounts`, {
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
    fetch(`${process.env.REACT_APP_LOCALHOST}/admin/accounts`, {
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
    fetch(`${process.env.REACT_APP_LOCALHOST}/admin/accounts`, {
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
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name, password })
      });
      const data = await response.json();
      return data;  // Ensure 'data' contains user ID and token
    } catch (error) {
      console.error('Error in checkCreds:', error);
      throw error;
    }
  };


export const getUserSchedule = async (uName) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/schedule`, {
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

export const getSchedDetailProf = async (uName) => {
  try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/schedule-prof`, {
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
      console.error('Error in getSchedDetailProf:', error);
      throw error; // Propagate error for further handling
  }
};

export const getRoom = async (rId) => {
    try {

        const url = new URL(`${process.env.REACT_APP_LOCALHOST}/user/rooms`);
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

// // Example function to get a user's schedule
// export const getUserSchedule = async (userId) => {
//     try {
//       const response = await axios.get(`/user/schedule/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching user schedule:", error);
//       throw error;
//     }
//   };
  
  // Function to change the user's password
  export const changePassword = async (user_name, oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/user/change-password`, {
        user_name,
        oldpass: oldPassword,
        newpass: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };


  // API Calls (in api/api.js)
export const createOccupation = async (occupationData) => {
    const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/occupation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(occupationData),
    });
    if (!response.ok) {
      throw new Error('Failed to create occupation');
    }
    return response.json();
  };
  
  export const updateOccupationStatus = async (occupationData) => {
    const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/occupation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(occupationData),
    });
    if (!response.ok) {
      throw new Error('Failed to update occupation status');
    }
    return response.json();
  };
  
  export const getOccupations = async (roomId) => {
    const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/occupations?room_id=${roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch occupations');
    }
    return response.json();
  };
  
    export const getRoomSpecific = async (roomId, setSched) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/user/validate-schedule/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room schedule');
        }
        const data = await response.json();
        setSched(data);
      } catch (error) {
        console.error('Error fetching room schedule:', error);
        throw error;
      }
    };

    // export const fetchRoomData = async (building_name, filter_date) => {
    //   try {
    //     const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/rooms/room-status`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ building_name, filter_date }),
    //     });
    
    //     if (!response.ok) {
    //       console.error("Error response from API:", response.status);
    //       throw new Error("Failed to fetch room data");
    //     }
    
    //     const data = await response.json();
    //     console.log("Room Data:", data); // Debugging log
    //     return data;
    //   } catch (error) {
    //     console.error("Error fetching room data:", error);
    //     throw error;
    //   }
    // };
    export const fetchRoomData = async (buildingNames, filterDate, roomPurpose) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/rooms/room-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            building_names: buildingNames, // Array of building names
            room_purpose: roomPurpose, // Optional room purpose
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching room data:", error);
        throw error;
      }
    };
    
    export const getInstructorCount = async () => {
      try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/instructor-count`);
      if (!response.ok) {
        throw new Error('Failed to fetch instructor count');
      }
      const data = await response.json();
      console.log('Instructor Countzzz:', data); // Debugging log
      return data;
      } catch (error) {
      console.error('Error fetching instructor count:', error);
      throw error;
      }
    }

    export const getStudentCount = async () => {
      try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/student-count`);
      if (!response.ok) {
        throw new Error('Failed to fetch student count');
      }
      const data = await response.json();
      console.log('Student Countzzz:', data); // Debugging log
      return data;
      } catch (error) {
      console.error('Error fetching student count:', error);
      throw error;
      }
    }
    
    export const getSection = async () => {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/sections`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    };

    export const createSection = async (dataToSend) =>{
      fetch(`${process.env.REACT_APP_LOCALHOST}/admin/sections`, {
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
    // comment