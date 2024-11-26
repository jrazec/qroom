import React from 'react';
import roomSearch from './RoomSearch.module.css';

const UserScheduleList = ({ userDetails }) => {
  return (
    <div className={roomSearch.leftSched}>
      {userDetails === undefined ? (
        <p>No Schedule Yet</p>
      ) : (
        userDetails.map((user, index) => (
          <div key={index} className={`${roomSearch.scheduleUser} mb-3`}>
            <img
              src={user.image}
              alt="User"
              style={{ objectFit: 'cover' }}
              className={`${roomSearch.userImage} img-fluid`}
            />
            <div className={roomSearch.userDetails}>
              <p>
                <strong>Instructor:</strong> {user.first_name} {user.middle_name}{' '}
                {user.last_name}
              </p>
              <p>
                <strong>Section:</strong> {user.section_name}
              </p>
              <p>
                <strong>Time:</strong> {user.time_start} - {user.time_end}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserScheduleList;
