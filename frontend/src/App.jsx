import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="534373960709-or74dtcdsrns9j7tsigilcrjmpcfjrme.apps.googleusercontent.com">
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;