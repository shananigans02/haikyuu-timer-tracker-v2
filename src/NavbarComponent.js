import React from 'react';

const NavbarComponent = ({ setPage, setTheme, theme }) => {
  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
  };

  return (
    <nav className={`flex justify-between items-center py-4 px-8 border rounded-xl mx-[2vw] mt-4 mb-4 ${
      theme === 'dark' 
        ? 'bg-transparent text-customOrange border-customOrange' 
        : 'bg-transparent text-darkBlue border-darkBlue'
    }`}>
      <div className="flex space-x-4">
        <div 
          className="font-semibold text-lg cursor-pointer" 
          onClick={() => setPage('tracker')}
        >
          tracker
        </div>
        <div 
          className="font-semibold text-lg cursor-pointer" 
          onClick={() => setPage('stats')}
        >
          stats
        </div>
      </div>
      <select 
        value={theme} 
        onChange={handleThemeChange} 
        className={`appearance-none bg-transparent font-semibold cursor-pointer ${
          theme === 'dark' ? 'text-customOrange' : 'text-darkBlue'
        }`}
      >
        <option value="light">light mode</option>
        <option value="dark">dark mode</option>
      </select>
    </nav>
  );
};

export default NavbarComponent;
