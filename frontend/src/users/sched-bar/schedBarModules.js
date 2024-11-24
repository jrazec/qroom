export const shortenDay = (day)=>{
    switch (day) {
      case "Monday":
        return "Mon";
      case "Tuesday":
        return "Tue";
      case "Wednesday":
        return "Wed";
      case "Thursday":
        return "Thu";
      case "Friday":
        return "Fri";
      case "Saturday":
        return "Sat";
      case "Sunday":
        return "Sun";
    }
}


export const convertTimeToDecimal=(timeString) =>{
  const [hours, minutes] = timeString.split(':').map(Number); // Split and convert to numbers
  const decimalHours = hours + (minutes / 60); // Calculate decimal hours
  return decimalHours.toFixed(2); // Format to two decimal places
};


// Convert time (7AM to 7PM) to percentage-based height for the rectangles
export const convertTimeToPosition = (time)=>{
  return ((time - 7) / 12) * 100;
}

export const fetchData = async (roomid=false,getData=false,setSchedule=false,setUserDetails=false,getRole,setUserRole=false,userid=false) => {
  try {
      console.log("Fetching data...");
      if(roomid){
        const fetchedData = await getData(roomid);
        const result = fetchedData.result;
        console.log(fetchedData)
        setSchedule(result.map(item => ({
          ...item, // Keep existing properties
          day: shortenDay(item.day),
          time_start: convertTimeToDecimal(item.time_start), // Convert time_start
          time_end: convertTimeToDecimal(item.time_end),     // Convert time_end

        })));
        if(setUserDetails){
          setUserDetails(result);
        }
      }

      if(getRole && setUserRole && userid){
        const userSched = await getRole(userid)
        setUserRole(userSched.result[0].role)
      }
  } catch (error) {
      console.error('Error fetching user schedule:', error);
  }
};

