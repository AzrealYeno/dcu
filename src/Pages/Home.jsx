import './Home.css';
import { NavLink } from 'react-router-dom';

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