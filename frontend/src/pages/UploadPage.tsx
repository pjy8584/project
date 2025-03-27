// UploadPage.tsx
import React, { useState } from 'react';
import CategoryChart from '../components/CategoryChart';
import ChannelFrequencyChart from '../components/ChannelFrequencyChart';
import WatchTimeHeatmap from '../components/WatchTimeHeatmap';

interface WatchRecord {
  title: string;
  date: Date | null;
  type: 'video' | 'music' | 'channel';
}

interface ChannelFreq {
  name: string;
  count: number;
}

interface WatchTime {
  day: string;
  hour: number;
  count: number;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<WatchRecord[]>([]);
  const [channelData, setChannelData] = useState<ChannelFreq[]>([]);
  const [heatmapData, setHeatmapData] = useState<WatchTime[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택하세요!');
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);

      const [videoRes, channelRes, timeRes] = await Promise.all([
        fetch('/upload', { method: 'POST', body: formData }),
        fetch('/upload/channels', { method: 'POST', body: formData }),
        fetch('/upload/watch-time', { method: 'POST', body: formData }),
      ]);

      if (!videoRes.ok || !channelRes.ok || !timeRes.ok) throw new Error('업로드 실패');

      const videoData = await videoRes.json();
      const channelData = await channelRes.json();
      const timeData = await timeRes.json();

      console.log('📦 영상 데이터:', videoData);
      console.log('📦 채널 데이터:', channelData);
      console.log('📦 히트맵 데이터:', timeData);

      setRecords(videoData);
      setChannelData(channelData);
      setHeatmapData(timeData);
    } catch (err) {
      console.error(err);
      alert('에러 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '3rem 1rem',
        maxWidth: 800,
        margin: '0 auto',
        background: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        📁 시청 기록 업로드
      </h2>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <label
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e3e4e7',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          파일 선택
          <input type="file" accept=".html" onChange={handleFileChange} hidden />
        </label>

        {file && (
          <span style={{ fontSize: '0.95rem', color: '#444' }}>
            선택된 파일: <strong>{file.name}</strong>
          </span>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: '0.5rem 1.2rem',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontWeight: 'bold',
          }}
        >
          {loading ? '업로드 중...' : '업로드'}
        </button>
      </div>

      {records.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <CategoryChart records={records} />
          <div style={{ marginTop: '2.5rem' }}>
            <ChannelFrequencyChart data={channelData} />
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <WatchTimeHeatmap data={heatmapData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;