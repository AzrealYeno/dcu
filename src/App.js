import { Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Games from './Pages/Games';
import GameScores from './Pages/GameScores';
import Empire from './Pages/Empire';
import AdminResults from './Pages/AdminResults';
import AdminEvents from './Pages/AdminEvents';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/games" element={<Games/>}/>
      <Route path="/games/:gameid" element={<GameScores/>}/>
      <Route path="/empire/:empireId" element={<Empire/>}/>
      <Route path="/admin/results" element={<AdminResults/>}/>
      <Route path="/admin/events" element={<AdminEvents/>}/>
    </Routes>
    </>
  );
}

export default App;
