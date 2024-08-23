import { Link, NavLink } from 'react-router-dom';
import logo from '../logo.svg';
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {db} from '../firebase';
import { appConfig } from '../config';
import {empireIds } from '../constants';


const GameScores = () => {

    const [game, setGame] = useState([]);
    const [ranks, setRanks] = useState([]);
    const {gameid} = useParams();


    const fetchGame = async () => {
       
        const docRef = doc(db, "events/" + appConfig.currentEvent + "/years/" + appConfig.currentYear + "/games/", gameid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : null;
        setGame(data);
       
        var newArr = [];
        for (let index = 0; index < empireIds.length; index++) {
            newArr.push({ score: data.ranking[empireIds[index]] , empireId:empireIds[index] });
        }
        setRanks(newArr.sort((a, b) => a.score < b.score ? 1 : -1));
       
    }
   
    useEffect(()=>{
        fetchGame();
    }, [])

	return (
		<div className="App">
            <div className="game-content">
                    
                                
                                <div>{game.name}</div>
                                <div>{game.info}</div>
                                {
                                    ranks.map((empire) => <li key={empire.empireId}>{empire.empireId} {empire.score}</li>)
                                }
                    
                </div>
        
      </div>
	);
};

export default GameScores;