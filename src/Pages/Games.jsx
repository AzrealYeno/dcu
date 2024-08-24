import './Games.css';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGames } from '../gameService';

const Games = () => {
    

 
   const [games, setGames] = useState([]);
 
    useEffect(()=>{
        const fetchGames = async () => {
            const games = await getGames();
             setGames(games);                
         }

        fetchGames();
    }, [setGames])


	return (
		<div className="App">
      
        <header className="App-header">
          
          
            <li>
                <NavLink to="/">Home</NavLink>
            </li>


          
          
        </header>

        

        <div className="games-content">
            {
                games?.map((game,i)=>(
                    <div key={i}>
                        
                        <Link to={`/games/${game.id}`}>
                            <div className="btn">{game.name}</div>
                        </Link>
                        <div>{game.info}</div>
                    </div>
                    
                ))
            }
        </div>




      </div>
	);
};

export default Games;