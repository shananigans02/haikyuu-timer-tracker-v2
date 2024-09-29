import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePomodoroGoal } from './pomodoroSlice';

const normalizeCategory = (category) => {
  return category.trim().toLowerCase();
};

const StatsComponent = ({ theme }) => {
  const pomodoroList = useSelector((state) => state.pomodoro.pomodoroList);
  const dispatch = useDispatch();
  const [categoryGoals, setCategoryGoals] = useState({});

  useEffect(() => {
    console.log("Pomodoro List in Stats Page: ", pomodoroList);
  }, [pomodoroList]);

  const today = new Date().toDateString();
  console.log("Today's date: ", today);

  const stats = useMemo(() => {
    const categoryStats = {};
    let totalTimeSpentToday = 0;

    pomodoroList.forEach((pomodoro) => {
      const pomodoroDate = new Date(pomodoro.startTime).toDateString();
      console.log(`Processing pomodoro: ${pomodoro.category}, Date: ${pomodoroDate}`);

      if (pomodoroDate === today) {
        const normalizedCategory = normalizeCategory(pomodoro.category);
        console.log("Normalized category: ", normalizedCategory);

        const timeParts = pomodoro.elapsedTime.split(' ');
        console.log("Elapsed Time Parts: ", timeParts);

        let timeSpentInSeconds = 0;
        if (timeParts[1] === 'seconds') {
          timeSpentInSeconds = parseInt(timeParts[0], 10);
        } else if (timeParts[1] === 'mins') {
          timeSpentInSeconds = parseInt(timeParts[0], 10) * 60;
        }
        console.log("Time spent in seconds: ", timeSpentInSeconds);

        if (!categoryStats[normalizedCategory]) {
          categoryStats[normalizedCategory] = {
            category: pomodoro.category,
            timeSpent: 0,
            goal: pomodoro.goal || 0,
          };
        }

        categoryStats[normalizedCategory].timeSpent += timeSpentInSeconds;
        totalTimeSpentToday += timeSpentInSeconds;
      }
    });

    console.log("Final Category Stats: ", categoryStats);
    console.log("Total time spent today: ", totalTimeSpentToday);

    return { categoryStats, totalTimeSpentToday };
  }, [pomodoroList, today]);

  const { categoryStats, totalTimeSpentToday } = stats;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return minutes > 0
      ? `${minutes} mins ${seconds > 0 ? `${seconds} seconds` : ''}`
      : `${seconds} seconds`;
  };

  const handleGoalChange = (category) => (e) => {
    const inputValue = e.target.value;
  
    // Allow empty input and prevent defaulting to NaN or '0'
    if (inputValue === '') {
      setCategoryGoals((prevGoals) => ({
        ...prevGoals,
        [category]: '',
      }));
      return;
    }
  
    const newGoal = parseInt(inputValue, 10) * 60; // Convert goal to seconds
    setCategoryGoals((prevGoals) => ({
      ...prevGoals,
      [category]: newGoal,
    }));
  
    dispatch(updatePomodoroGoal({ category, goal: newGoal }));
  };

  const handleShare = () => {
    let message = "today's gains: \n";
    Object.keys(categoryStats).forEach((key) => {
      const { category, timeSpent } = categoryStats[key];
      message += `${formatTime(timeSpent)}: ${category}\n`
    })
    
    const encodedMessage = encodeURIComponent(message);

    const xUrl = `https://x.com/compose/post?text=${encodedMessage}`;

    window.open(xUrl, '_blank');
  }

  // Determine theme classes based on the selected theme
  const baseColor = theme === 'dark' ? 'text-customOrange' : 'text-darkBlue';
  const borderColor = theme === 'dark' ? 'border-customOrange rounded-xl' : 'border-darkBlue rounded-xl';
  const bgColor = theme === 'dark' ? 'bg-transparent' : 'bg-transparent';

  return (
    <div className={`flex flex-col items-center p-4 ${baseColor}`}>
      <h2 className="text-xl font-semibold mb-4">today's gains</h2>
      
      <div className="w-full max-w-lg">
        {Object.keys(categoryStats).length === 0 ? (
          <p>no work logged today yet ~</p>
        ) : (
          Object.keys(categoryStats).map((key) => {
            const { category, timeSpent, goal } = categoryStats[key];
            const percentage = goal > 0 ? Math.min(100, (timeSpent / goal) * 100) : 0;

            return (
              <div key={key} className={`mb-4 p-4 ${bgColor} rounded shadow border ${borderColor}`}>
                <div className="flex justify-between">
                  <span className="font-semibold">{category}</span>
                  <span>{formatTime(timeSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>goal: 
                    <input
                      type="number"
                      value={categoryGoals[key] ? categoryGoals[key] / 60 : goal / 60}
                      onChange={handleGoalChange(key)}
                      className={`border p-1 w-16 ml-2 border-transparent bg-transparent`}
                    /> mins
                  </span>
                  <span>{percentage.toFixed(1)}% completed</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={`w-full max-w-lg mt-4 p-4 ${bgColor} rounded shadow border ${borderColor}`}>
        <h3 className="font-semibold">total time worked today:</h3>
        <p>{formatTime(totalTimeSpentToday)}</p>
      </div>
      
      <button
        onClick={handleShare}
        className={`max-w-lg mt-6 px-6 py-3 border rounded-xl shadow ${baseColor} ${borderColor}`}
      >
        share
      </button>
      
    </div>
  );
};

export default StatsComponent;
