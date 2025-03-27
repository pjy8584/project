// 📄 frontend/src/components/ChannelBarChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChannelData {
  name: string;
  count: number;
}

interface Props {
  data: ChannelData[];
}

const ChannelBarChart: React.FC<Props> = ({ data }) => {
  const topData = data.slice(0, 20);

  return (
    <div style={{ width: '100%', height: 700, padding: '1rem', background: '#f7f8fc', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.6rem', color: '#444' }}>
        📊 자주 시청한 채널 (TOP 20)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={topData}
          margin={{ top: 20, right: 40, left: 160, bottom: 40 }}
          barCategoryGap={12}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a18cd1" />
              <stop offset="100%" stopColor="#fbc2eb" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 13, fill: '#333' }}
            interval={0}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontSize: '14px',
            }}
            formatter={(value: any) => [`${value}회`, '시청 수']}
          />
          <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 10, 10, 0]}>
            {topData.map((_, idx) => (
              <Cell key={`cell-${idx}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChannelBarChart;