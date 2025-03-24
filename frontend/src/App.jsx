import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // ✅ 대시보드 추가
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="534373960709-or74dtcdsrns9j7tsigilcrjmpcfjrme.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ 추가 */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;