import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className='app'>
      
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
 
    </div>
  );
};

export default App;
