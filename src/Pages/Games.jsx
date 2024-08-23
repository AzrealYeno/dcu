import { Link, NavLink } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import {db} from '../firebase';
import { useState, useEffect } from 'react';

const Games = () => {
    

 
   const [games, setGames] = useState([]);
 
    const fetchPost = async () => {
       
        await getDocs(collection(db, "games"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setGames(newData);                
                console.log(games, newData);
            })
       
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
                    <p key={i}>
                        {game.Name}
                    </p>
                ))
            }
        </div>




      </div>
	);
};

export default Games;