import './Games.css';
import { Link, NavLink } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import {db} from '../firebase';
import { useState, useEffect } from 'react';
import { appConfig } from '../config';

const Games = () => {
    

 
   const [games, setGames] = useState([]);
 
    const fetchPost = async () => {
       
        await getDocs(collection(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setGames(newData);                
                console.log(games, newData);
            });
       
    }
   
    useEffect(()=>{
        fetchPost();
    }, [])


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