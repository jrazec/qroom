import React from 'react';
import UserScheduleList from './UserScheduleList';
import ScheduleContainer from './ScheduleContainer';
import roomSearch from './RoomSearch.module.css';

const RoomDetails = ({ userDetails, schedule, dayMap }) => {
  return (
    <div className={`col-md-6 ${roomSearch.rightSection}`}>
      <div className={roomSearch.scheduleWrapper}>
        <UserScheduleList userDetails={userDetails} />
        <ScheduleContainer schedule={schedule} dayMap={dayMap} />
      </div>
    </div>
  );
};

export default RoomDetails;
