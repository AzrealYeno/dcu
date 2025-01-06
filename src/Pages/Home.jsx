import './Home.css';
import { NavLink, Link } from 'react-router-dom';
import home_title from "../assets/home_title.png";
import home_empirenames from "../assets/home_empire_names.png";
import home_phoenix from "../assets/home_phoenix.png";
import home_pegasus from "../assets/home_pegasus.png";
import home_shinobi from "../assets/home_shinobi.png";
import home_chimera from "../assets/home_chimera.png";
import games_btn from "../assets/games_btn.png";
import scores_btn from "../assets/scores_btn.png";
import Navbar from '../Navbar';


const Home = () => {

  return (
    <div className="App">
      <Navbar />
      <div className="home_container">
        <div className="menuContainer">
        
          <div className="menu_title">
            <img src={home_title} className="title_img" alt="games"></img>
          </div>

          <div className="menu">
            <NavLink to="/gamedesc">
              <img src={games_btn} className="menu_img" alt="games"></img>
            </NavLink>
          </div>

          <div className="menu">
            <NavLink to="/games">
              <img src={scores_btn} className="menu_img" alt="scores"></img>
            </NavLink>
          </div>
          
        </div>


          <div className="empire_list">
            <Link to={`/empire/phoenix`} className="empire_link">
              <img src={home_phoenix} className="empire_img" alt="phoenix"></img>
              <div className="empire_name">Phoenix</div>
            </Link>

            <Link to={`/empire/pegasus`} className="empire_link">
              <img src={home_pegasus} className="empire_img" alt="pegasus"></img>
              <div className="empire_name">Pegasus</div>
            </Link>

            <Link to={`/empire/shinobi`} className="empire_link">
              <img src={home_shinobi} className="empire_img" alt="shinobi"></img>
              <div className="empire_name">Shinobi</div>
            </Link>

            <Link to={`/empire/chimera`} className="empire_link">
              <img src={home_chimera} className="empire_img" alt="chimera"></img>
              <div className="empire_name">Chimera</div>
            </Link>
          </div>


      </div>
    </div>
  );
};

export default Home;