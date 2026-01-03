import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Jul", score: 72 },
  { month: "Aug", score: 78 },
  { month: "Sep", score: 85 },
  { month: "Oct", score: 82 },
  { month: "Nov", score: 90 },
  { month: "Dec", score: 94 },
  { month: "Jan", score: 96 },
];

export function ComplianceChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Compliance Score Trend
        </h2>
        <span className="ml-auto font-mono text-2xl font-bold text-neon-green text-glow-green">
          96%
        </span>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(155, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(155, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 4%, 16%)" />
            <XAxis
              dataKey="month"
              stroke="hsl(240, 5%, 64.9%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              stroke="hsl(240, 5%, 64.9%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[60, 100]}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 6%, 10%)",
                border: "1px solid hsl(240, 4%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
              labelStyle={{ color: "hsl(0, 0%, 95%)" }}
              itemStyle={{ color: "hsl(155, 100%, 50%)" }}
              formatter={(value: number) => [`${value}%`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(155, 100%, 50%)"
              strokeWidth={2}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
