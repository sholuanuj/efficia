import React, { useEffect, useState } from "react";

interface SummaryItem {
  app_name: string;
  total_time: number; // in seconds
}

const DailySummary: React.FC = () => {
  const [data, setData] = useState<SummaryItem[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/daily-summary")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

//   const formatTime = (seconds: number): string => {
//     const dur = seconds;
//     return `${dur}s`;
//   };

// Utility function to format time
const formatTime = (totalSeconds: number) => {
  const totalMinutes = Math.floor(totalSeconds / 60); // or directly item.total_time if already in minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) return "0 mins";
  if (hours === 0) return `${minutes} min${minutes > 1 ? "s" : ""}`;
  if (minutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""}`;
};

// Component
return (
  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      Daily Summary ssd fdfsdf
    </h2>
    <ul>
      {data.map((item) => (
        <li
          key={item.app_name}
          className="mb-2 text-gray-700 dark:text-gray-300"
        >
          <strong>{item.app_name}:</strong> gv{formatTime(item.total_time)}
        </li>
      ))}
    </ul>
  </div>
);
}
export default DailySummary;
