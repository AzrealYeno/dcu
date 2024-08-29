import './Home.css';
import { NavLink, Link } from 'react-router-dom';
import home_phoenix from "../assets/home_phoenix.png";
import home_pegasus from "../assets/home_pegasus.png";
import home_shinobi from "../assets/home_shinobi.png";
import home_chimera from "../assets/home_chimera.png";
import games_btn from "../assets/games_btn.png";
import scores_btn from "../assets/scores_btn.png";

const Home = () => {

  return (
    <div className="App">
      <div className="home_container">
        <div className="App-header">
        </div>

        <div className="menuContainer">
          <div className="menu">
            <NavLink to="/games">
              <img src={games_btn} className="manu_img" alt="games"></img>
            </NavLink>
          </div>

          <div className="menu">
            <NavLink to="/games">
              <img src={scores_btn} className="manu_img" alt="scores"></img>
            </NavLink>
          </div>
        </div>

        <div className="listContainer">

          <div className="empire_list">
            <Link to={`/empire/phoenix`} className="link">
              <img src={home_phoenix} className="empire" alt="phoenix"></img>
            </Link>

            <Link to={`/empire/pegasus`} className="link">
              <img src={home_pegasus} className="empire" alt="pegasus"></img>
            </Link>

            <Link to={`/empire/shinobi`} className="link">
              <img src={home_shinobi} className="empire" alt="shinobi"></img>
            </Link>

            <Link to={`/empire/chimera`} className="link">
              <img src={home_chimera} className="empire" alt="chimera"></img>
            </Link>

          </div>
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