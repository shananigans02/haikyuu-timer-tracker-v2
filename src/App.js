import React, { useState } from 'react';
import TimerComponent from './TimerComponent';
import NavbarComponent from './NavbarComponent';
import StatsComponent from './StatsComponent';

function App() {
  const [page, setPage] = useState('tracker');
  const [theme, setTheme] = useState('light');

  const containerBorderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

  return (
    <div className={`App ${theme === 'dark' ? 'bg-darkBlue' : 'bg-customOrange'} min-h-screen overflow-hidden`}>
      <NavbarComponent setPage={setPage} setTheme={setTheme} theme={theme} />

      <div className={`mx-[2vw] my-4 mb-[2vw] p-4 border rounded-xl shadow ${containerBorderColor}`}>
      {page === 'tracker' ? <TimerComponent theme={theme} /> : <StatsComponent theme={theme} />}
      </div>
    </div>
  );
}

export default App;
