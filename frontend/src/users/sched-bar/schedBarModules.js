export const shortenDay = (day) => {
  switch (day) {
    case 'Monday':
      return 'Mon';
    case 'Tuesday':
      return 'Tue';
    case 'Wednesday':
      return 'Wed';
    case 'Thursday':
      return 'Thu';
    case 'Friday':
      return 'Fri';
    case 'Saturday':
      return 'Sat';
    case 'Sunday':
      return 'Sun';
    default:
      return day;
  }
};

export const convertTimeToDecimal = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours + minutes / 60).toFixed(2);
};

export const convertTimeToPosition = (time) => {
  return ((time - 7) / 12) * 100;
};

export const fetchData = async (
  roomid = false,
  getData = false,
  setSchedule = false,
  setUserDetails = false,
  getRole = false,
  setUserRole = false,
  userid = false
) => {
  try {
    console.log('Fetching data...');
    if (roomid) {
      const fetchedData = await getData(roomid);
      const result = fetchedData.result || [];
      console.log('Fetched Data:', result);

      if (setSchedule) {
        setSchedule(
          result.map((item) => ({
            ...item,
            day: shortenDay(item.day),
            time_start: convertTimeToDecimal(item.time_start),
            time_end: convertTimeToDecimal(item.time_end),
          }))
        );
      }

      if (setUserDetails) {
        setUserDetails(result);
      }
    }

    if (getRole && setUserRole && userid) {
      const userSched = await getRole(userid);
      setUserRole(userSched.result[0]?.role || 'Unknown');
      console.log('Fetched User Role:', userSched.result[0]?.role);
    }
  } catch (error) {
    console.error('Error fetching user schedule:', error);
  }
};
