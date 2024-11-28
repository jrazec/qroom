import React from 'react';
import roomSearch from './RoomSearch.module.css';
import { convertTimeToPosition } from '../sched-bar/schedBarModules';

const ScheduleContainer = ({ schedule, dayMap }) => {
  return (
    <div className={roomSearch.scheduleContainer}>
      <div className={`${roomSearch.days} d-flex justify-content-between`}>
        {dayMap.map((day, index) => (
          <div key={index} className={roomSearch.dayLabel}>
            {day}
          </div>
        ))}
      </div>
      <div className={roomSearch.scheduleContent}>
        {schedule === undefined ? (
          <p>No schedule assigned.</p>
        ) : (
          schedule.map((item, index) => (
            <div
              key={index}
              className={roomSearch.scheduleBlock}
              style={{
                top: `${convertTimeToPosition(item.time_start)}%`,
                height: `${
                  convertTimeToPosition(item.time_end) -
                  convertTimeToPosition(item.time_start)
                }%`,
                left: `${dayMap.indexOf(item.day) * 14.28}%`,
              }}
            >
              <div className={roomSearch.topBlock}>
                {item.time_start > 12.6
                  ? `${parseFloat(item.time_start - 12)
                      .toFixed(2)
                      .replace('.', ':')}pm`
                  : `${item.time_start}`.replace('.', ':').concat('am')}
              </div>
              <div className={roomSearch.botBlock}>
                {item.time_end > 12.6
                  ? `${parseFloat(item.time_end - 12)
                      .toFixed(2)
                      .replace('.', ':')}pm`
                  : `${item.time_end}`.replace('.', ':').concat('am')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleContainer;
