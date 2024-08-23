import { Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Games from './Pages/Games';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/games" element={<Games/>}/>
    </Routes>
    </>
  );
}

export default App;
