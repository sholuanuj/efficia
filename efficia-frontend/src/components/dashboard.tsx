import React, { useEffect, useState } from "react";

type ActivityLog = {
  id: number;
  app_name: string;
  window_title: string;
  duration: number;
  timestamp: string;
};

type AppSummary = {
  app_name: string;
  total_duration: number;
};

export default function Dashboard() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<AppSummary[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/activity")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);

        // Group and summarize data by app_name
        const summaryMap: { [key: string]: number } = {};
        data.forEach((log: ActivityLog) => {
          if (!summaryMap[log.app_name]) summaryMap[log.app_name] = 0;
          summaryMap[log.app_name] += log.duration;
        });

        const summaryArray = Object.entries(summaryMap).map(
          ([app_name, total_duration]) => ({ app_name, total_duration })
        );

        setSummary(summaryArray);
      })
      .catch((err) => console.error("Error fetching activity logs:", err));
  }, []);

  const formatTime = (totalSeconds: number) => {
  const totalMinutes = Math.floor(totalSeconds / 60); // or directly item.total_time if already in minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) return "0 mins";
  if (hours === 0) return `${minutes} min${minutes > 1 ? "s" : ""}`;
  if (minutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""}`;
};

  return (
    <div className="p-6 space-y-8">
      {/* Summary Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {summary.map((item) => (
            <li key={item.app_name} className="flex justify-between border-b pb-1">
              <span className="font-medium">{item.app_name}</span>
              <span className="text-gray-600"> {formatTime(item.total_duration)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Logs Table */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 border">App</th>
              <th className="text-left p-2 border">Window Title</th>
              <th className="text-left p-2 border">Duration</th>
              <th className="text-left p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="p-2 border">{log.app_name}</td>
                <td className="p-2 border">{log.window_title}</td>
                <td className="p-2 border">{log.duration} sec</td>
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
