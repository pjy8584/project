// 📄 frontend/src/components/CategoryChart.tsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WatchRecord {
  title: string;
  date: Date | null;
  type: 'video' | 'music' | 'channel';
  category?: string; // ✅ 이 줄 추가!
}

interface Props {
  records: WatchRecord[];
}

// ✅ 카테고리 분류 기준 함수
const categorizeTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('vlog') || lower.includes('브이로그')) return 'Vlog';
  if (lower.includes('playlist') || lower.includes('플리') || lower.includes('음악')) return 'Music';
  if (lower.includes('asmr')) return 'ASMR';
  if (lower.includes('game') || lower.includes('게임')) return 'Game';
  if (lower.includes('news') || lower.includes('뉴스')) return 'News';
  if (lower.includes('강의') || lower.includes('lecture') || lower.includes('공부') || lower.includes('study')) return 'Study';
  return 'Other';
};

const CategoryChart: React.FC<Props> = ({ records }) => {
  const filtered = records.filter(record => record.type === 'video');
  const categoryCounts: Record<string, number> = {};

  filtered.forEach(record => {
    const category = record.category || 'Other';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const labels = Object.keys(categoryCounts);
  const data = Object.values(categoryCounts);

  const backgroundColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#A5DF00', '#E91E63',
  ];

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(to top, #f8f9fa, #ffffff)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#333' }}>
        🎯 시청 카테고리 분석
      </h2>
      <Pie
        data={{
          labels,
          datasets: [
            {
              label: '시청 수',
              data,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderWidth: 2,
              borderColor: '#fff',
              hoverOffset: 12,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default CategoryChart;