import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate

interface Reminder {
  _id: string;
  title: string;
  dueDate: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    reminders: [] as Reminder[],
    projectsByStatus: {} as Record<string, number>,
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Dark mode state

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Persist dark mode preference in localStorage
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clientsRes = await axios.get("/api/auth/clients"); // ✅ correct endpoint
        const projectsRes = await axios.get("/api/projects");
        const remindersRes = await axios.get("/api/reminders"); // Fetch all reminders

        const projectsArray = projectsRes.data.projects || projectsRes.data;

        const projectStatusCount: Record<string, number> = {};

        projectsArray.forEach((project: any) => {
          if (project.status) {
            projectStatusCount[project.status] =
              (projectStatusCount[project.status] || 0) + 1;
          }
        });

        setStats({
          totalClients: clientsRes.data.length,
          totalProjects: projectsArray.length,
          reminders: remindersRes.data, // Store all reminders
          projectsByStatus: projectStatusCount,
        });
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // 🛠️ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen p-6`}>
      {/* Light/Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total Clients
            </h2>
            <p className="text-3xl mt-2">{stats.totalClients}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total Projects
            </h2>
            <p className="text-3xl mt-2">{stats.totalProjects}</p>
          </div>
        </div>

        {/* Reminders Due Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Reminders Due Soon
          </h2>
          {stats.reminders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No upcoming reminders
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {stats.reminders.map((reminder) => (
                <li
                  key={reminder._id}
                  className="text-gray-800 dark:text-white"
                >
                  {reminder.title} - Due:{" "}
                  {new Date(reminder.dueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Projects by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Projects by Status
          </h2>
          {Object.keys(stats.projectsByStatus).length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No project data available
            </p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                <li key={status} className="text-gray-800 dark:text-white">
                  {status}: {count}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Navigation Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Quick Navigation
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/clients")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-lg"
            >
              Go to Clients
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg"
            >
              Go to Projects
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Logout
          </h2>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
