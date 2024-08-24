import './Home.css';
import { NavLink } from 'react-router-dom';
import logo from '../logo.svg';



const Home = () => {

  return (
    <div className="App">
      <header className="App-header">
        <li>
          <NavLink to="/games">Games</NavLink>
        </li>
      </header>
    </div>
  );
};

export default Home;