import React from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

interface HeatmapDataPoint {
  day: string;
  hour: number;
  count: number;
}

interface Props {
  data: HeatmapDataPoint[];
}

const getColorByCount = (count: number): string => {
  const min = 1;
  const max = 50;
  const normalized = Math.min(1, (count - min) / (max - min));
  const hue = 260 - normalized * 180;
  return `hsl(${hue}, 80%, 60%)`;
};

// ✨ 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { count } = payload[0].payload;
    return (
      <div
        style={{
          background: '#fff',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: 8,
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        시청 횟수: {count}회
      </div>
    );
  }
  return null;
};

const WatchTimeHeatmap: React.FC<Props> = ({ data }) => {
  const enhancedData = data.map((point) => ({
    ...point,
    fill: getColorByCount(point.count),
  }));

  return (
    <div style={{ maxWidth: 900, margin: '3rem auto', padding: '1rem' }}>
      <h3
        style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          marginBottom: '2rem',
          fontWeight: 700,
          color: '#222',
        }}
      >
        🕒 요일 & 시간대별 시청 히트맵
      </h3>
      <ResponsiveContainer width="100%" height={460}>
        <ScatterChart margin={{ top: 30, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="category"
            dataKey="day"
            name="요일"
            ticks={days}
            interval={0}
            tick={{ fontWeight: 'bold', fontSize: 14, fill: '#333' }}
            label={{ value: '요일', position: 'insideBottom', offset: -10, fontSize: 14 }}
          />
          <YAxis
            type="number"
            dataKey="hour"
            name="시간"
            domain={[0, 23]}
            ticks={hours}
            tickFormatter={(h) => `${h}시`}
            tick={{ fontSize: 12, fill: '#555' }}
            label={{ value: '시간대', angle: -90, position: 'insideLeft', fontSize: 14 }}
          />
          <ZAxis type="number" dataKey="count" range={[80, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="시청 기록"
            data={enhancedData}
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WatchTimeHeatmap;