import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPomodoro, deletePomodoro, updateTimerState, setCurrentCategory } from './pomodoroSlice';
import CustomCheckbox from './CustomCheckbox';

const TimerComponent = ({ theme }) => {
  const {
    timeLeft,
    isRunning,
    startTime,
    lastStartTime,
    totalElapsedTime,
    currentCategory
  } = useSelector((state) => state.pomodoro);
  
  const [duration, setDuration] = useState(30);
  const [timerEnded, setTimerEnded] = useState(false);
  // const [notification, setNotification] = useState('');

  const pomodoroList = useSelector((state) => state.pomodoro.pomodoroList);
  const dispatch = useDispatch();

  const stopTimer = useCallback(() => {
    dispatch(updateTimerState({
      timeLeft: 0,
      isRunning: false,
      startTime: null,
      lastStartTime: null,
      totalElapsedTime: 0
    }));
    dispatch(setCurrentCategory(''));
  }, [dispatch]);

  const logPomodoro = useCallback((isManualRecord = false) => {
    const now = Date.now();
    const timeSpentSinceLastStart = Math.floor((now - lastStartTime) / 1000); 
    const totalTimeSpent = totalElapsedTime + timeSpentSinceLastStart;

    const pomodoro = {
      category: currentCategory,
      duration,
      startTime: new Date(startTime),  
      endTime: new Date(now),  
      elapsedTime: totalTimeSpent < 60
        ? `${totalTimeSpent} seconds`
        : `${Math.floor(totalTimeSpent / 60)} mins`,
    };

    dispatch(addPomodoro(pomodoro));

    if (isManualRecord) {
      alert("grind recorded!");
      stopTimer();
    }
  }, [currentCategory, duration, startTime, totalElapsedTime, lastStartTime, dispatch, stopTimer]);

  const handleTimerEnd = useCallback(() => {
    if (!timerEnded) { 
      dispatch(updateTimerState({ isRunning: false }));
      setTimerEnded(true); 
      logPomodoro();
      const audio = new Audio(`${process.env.PUBLIC_URL}/haikyuu commercial break soft melody (ringtone) copy.mp3`);
      audio.play();

      setTimeout(() => {
        alert("time's up - you did it!");  
      }, 100);

      // setNotification("time's up!");
    }
  }, [logPomodoro, timerEnded, dispatch]);

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsedTime = Math.floor((now - lastStartTime) / 1000);
        const newTimeLeft = Math.max(0, duration * 60 - totalElapsedTime - elapsedTime);

        // console.log('Updating timer:', { now, lastStartTime, elapsedTime, newTimeLeft, duration, totalElapsedTime });

        dispatch(updateTimerState({ timeLeft: newTimeLeft }));

        const minutesLeft = Math.floor(newTimeLeft / 60);
        const secondsLeft = newTimeLeft % 60;
        document.title = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft} left ~`;

        if (newTimeLeft <= 0) {
          handleTimerEnd();
        }
      };

      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }

    return () => {
      clearInterval(timer);
      document.title = "it's lock in time";
    };
  }, [isRunning, totalElapsedTime, lastStartTime, duration, handleTimerEnd, dispatch]);

  const toggleTimer = () => {
    const now = Date.now();
    // if category input is empty, alert
    if (!currentCategory.trim()) {
      alert("pls tell us what you are grinding ~");
      return;
    }
    if (isRunning) {
      const timeSpentSinceLastStart = Math.floor((now - lastStartTime) / 1000);
      dispatch(updateTimerState({
        totalElapsedTime: totalElapsedTime + timeSpentSinceLastStart,
        isRunning: false,
        lastStartTime: null
      }));
    } else {
      if (timeLeft === 0) {
        console.log('Starting new timer:', { duration, now, currentCategory });
        dispatch(updateTimerState({
          timeLeft: duration * 60,
          startTime: now,
          totalElapsedTime: 0,
          isRunning: true,
          lastStartTime: now
        }));
        setTimerEnded(false);
      } else {
        console.log('Resuming timer:', { timeLeft, now, currentCategory });
        dispatch(updateTimerState({ lastStartTime: now, isRunning: true }));
      }
    }
  };

  const handleDeletePomodoro = (index) => {
    dispatch(deletePomodoro(index));
  };

  const formatDateTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine theme classes based on the selected theme
  const baseColor = theme === 'dark' ? 'bg-darkBlue text-customOrange' : 'bg-customOrange text-darkBlue';
  const borderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

  return (
    <div className={`flex flex-col items-center justify-center ${baseColor}`}>
      <div 
        className={`font-mono p-1 mb-1`}
        style={{
          fontSize: `clamp(4rem, 20vw, 11rem)`,
        }}
      >
        {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
      </div>

      <div className="flex space-x-2 mb-4 w-full max-w-lg">
        <input
          type="text"
          value={currentCategory}
          onChange={(e) => dispatch(setCurrentCategory(e.target.value))}
          placeholder="Working on..."
          className={`font-mono font-bold p-2 border rounded-xl shadow w-full ${borderColor} ${baseColor} ${theme === 'dark' ? 'placeholder-dark' : 'placeholder-light'}`} 
          disabled={isRunning}
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => {
            const newDuration = parseInt(e.target.value);
            setDuration(newDuration);
            if (!isRunning) {
              dispatch(updateTimerState({ timeLeft: newDuration * 60 }));
            }
          }}
          placeholder="Duration (mins)"
          className={`font-bold p-2 border rounded-xl w-24 shadow ${borderColor} ${baseColor}`}
          disabled={isRunning}
        />
      </div>

      <div className="flex justify-between space-x-2 w-full max-w-lg">
        <button
          onClick={toggleTimer}
          className={`font-bold px-6 py-3 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
        >
          {isRunning ? 'pause' : 'start'}
        </button>
        <button
          onClick={stopTimer}
          className={`font-bold px-6 py-3 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
        >
          stop
        </button>
        {isRunning && (
          <button
            onClick={() => logPomodoro(true)}
            className={`font-bold px-6 py-3 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
          >
            record
          </button>
        )}
      </div>

      <div className={`mt-8 w-full max-w-lg p-4 rounded-lg border shadow ${baseColor} ${borderColor}`}>
        <h2 className="text-lg font-semibold mb-4">sets:</h2>
        <ul className="space-y-2">
          {pomodoroList.map((pomodoro, index) => (
            <li key={index} className={`flex items-center space-x-2 border-b py-2 ${borderColor}`}>
              <CustomCheckbox
                checked={true}
                onChange={() => {
                  if (window.confirm("delete this entry?")) {
                    handleDeletePomodoro(index);
                  }
                }}
                theme={theme}
              />
              <span>
                {formatDateTime(new Date(pomodoro.startTime))} - {formatDateTime(new Date(pomodoro.endTime))} ({pomodoro.elapsedTime}): {pomodoro.category}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* times up notification banner
      <div className={`flex flex-col items-center justify-center ${baseColor}`}>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div> */}

    </div>
  );
};

export default TimerComponent;