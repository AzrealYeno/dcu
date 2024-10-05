import { Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Games from './Pages/Games';
import GameScores from './Pages/GameScores';
import Empire from './Pages/Empire';
import AdminAwards from './Pages/AdminAwards';
import AdminEvents from './Pages/AdminEvents';
import AdminGames from './Pages/AdminGames';
import Admin from './Pages/Admin';
import AdminScores from './Pages/AdminScores';
import AdminUsers from './Pages/AdminUsers';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/games" element={<Games/>}/>
      <Route path="/games/:gameid" element={<GameScores/>}/>
      <Route path="/empire/:empireId" element={<Empire/>}/>
      <Route path="/admin/awards" element={<AdminAwards/>}/>
      <Route path="/admin/scores" element={<AdminScores/>}/>
      <Route path="/admin/events" element={<AdminEvents/>}/>
      <Route path="/admin/games" element={<AdminGames/>}/>
      <Route path="/admin/users" element={<AdminUsers/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
    </>
  );
}

export default App;
