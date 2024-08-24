import './Home.css';
import { NavLink, Link } from 'react-router-dom';
import { empireIds, empires } from '../constants';

const Home = () => {

  return (
    <div className="App">
      <div className="home_container">
        <div className="App-header">
          <div>
            <NavLink to="/games">Games</NavLink>
          </div>
        </div>

        <div className="empire_list">
          {
            empireIds.map((empireId) => (
              <div key={empireId}>
                <Link to={`/empire/${empireId}`}>
                  <div className="btn">{empires[empireId].name}</div>
                </Link>
              </div>
            ))
          }
        </div>

        {/* <NavLink to="/empire/chimera">Chimera</NavLink>
        <NavLink to="/empire/shinobi">Shinobi</NavLink>
        <NavLink to="/empire/pegasus">Pegasus</NavLink>
        <NavLink to="/empire/phoenix">Phoenix</NavLink> */}
      </div>
    </div>
  );
};

export default Home;