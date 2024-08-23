import { Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Games from './Pages/Games';
import GameScores from './Pages/GameScores';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/games" element={<Games/>}/>
      <Route path="/games/:gameid" element={<GameScores/>}/>
    </Routes>
    </>
  );
}

export default App;
