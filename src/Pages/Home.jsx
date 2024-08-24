import './Home.css';
import { NavLink, Link } from 'react-router-dom';
import { empireIds, empires } from '../constants';

const Home = () => {

  return (
    <div className="App">
      <header className="App-header">
        <li>
          <NavLink to="/games">Games</NavLink>
        </li>
      </header>
      <ul>
      {
        
                empireIds.map((empireId)=>(
                    <li key={empireId}>
                        <Link to={`/empire/${empireId}`}>
                        <div className="btn">{empires[empireId].name}</div>
                        </Link>
                    </li>
                    
                ))
            }
        
      </ul>
      <NavLink to="/empire/chimera">Chimera</NavLink>
      <NavLink to="/empire/shinobi">Shinobi</NavLink>
      <NavLink to="/empire/pegasus">Pegasus</NavLink>
      <NavLink to="/empire/phoenix">Phoenix</NavLink>
    </div>
  );
};

export default Home;