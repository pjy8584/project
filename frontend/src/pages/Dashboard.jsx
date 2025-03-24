import axios from 'axios';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 이용해주세요!');
      window.location.href = '/'; // 로그인 페이지로 이동
      return;
    }

    axios.get('http://localhost:3000/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log('유저 정보:', res.data);
      setUser(res.data.user);
    }).catch(err => {
      console.error('인증 실패:', err);
      window.location.href = '/'; // 토큰이 만료되거나 에러면 다시 로그인
    });
  }, []);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">환영합니다, {user.name}님!</h1>
      <img
        src={user.picture}
        alt="프로필"
        className="rounded-full w-32 h-32 mb-4"
      />
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        로그아웃
      </button>
    </div>
  );
}

export default Dashboard;