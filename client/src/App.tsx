import React, { useEffect, useState } from "react";
import RoutesComponent from "./routes";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen`}>
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
      <RoutesComponent /> {/* Displaying routes here */}
    </div>
  );
};

export default App;
