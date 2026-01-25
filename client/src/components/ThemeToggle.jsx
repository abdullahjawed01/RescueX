import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition duration-300 ease-in-out ${theme === "dark"
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
};

export default ThemeToggle;
