import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Reg } from './pages/reg';
import { Log } from './pages/login';
import { Create } from './pages/create';
import { Profile } from './pages/profile';
import { Forgot } from './pages/forgotpassword';
import { Cod } from './pages/emailcod'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/reg" replace />} />
        
        <Route path="/reg" element={<Reg />} />
        
        <Route path="/login" element={<Log />} />

        <Route path="/create" element={<Create />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/forgotpassword" element={<Forgot />}></Route>

        <Route path='/emailcod' element={<Cod/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;