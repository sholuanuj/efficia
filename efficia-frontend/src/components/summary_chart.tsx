import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Activity {
  app: string;
  duration: number;
}

interface Props {
  data: Activity[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

export default function SummaryChart({ data }: Props) {
  const appDurations = data.reduce((acc, log) => {
    acc[log.app] = (acc[log.app] || 0) + log.duration;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(appDurations).map(([app, duration]) => ({
    name: app,
    value: duration,
  }));

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Time Spent per App</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
