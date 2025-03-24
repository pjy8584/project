import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {
  const navigate = useNavigate(); // React Router의 navigate 훅 사용

  const handleLoginSuccess = async (credentialResponse) => {
    console.log("구글 로그인 성공!", credentialResponse);
    console.log("credential 값:", credentialResponse.credential);

    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        credential: credentialResponse.credential
      });

      console.log('✅ 백엔드에서 받은 user 정보:', res.data.user);
      console.log('✅ 받은 토큰:', res.data.token);

      // JWT 저장 및 라우팅 처리
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard'); // 로그인 후 대시보드로 이동
      }

    } catch (error) {
      console.error('백엔드 요청 실패:', error);
    }
  };

  const handleLoginFailure = () => {
    console.log("구글 로그인 실패!");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-10 w-[400px]">
      <h1 className="text-3xl font-bold mb-8">로그인하기</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
}

export default Login;