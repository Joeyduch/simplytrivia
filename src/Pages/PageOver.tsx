
// packages
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// classes
import { GameFinalData } from "../Classes/GameData";

// components
import Button from "../Components/General/Button/Button"

// style
import style from "./PageOver.module.css";







export default function PageOver() {
    const location = useLocation();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState<GameFinalData|null>(null);


    useEffect(() => {
        if(!location.state) {
            console.error("No state in location");
            navigate("/");
            return;
        }

        const gameOverData:GameFinalData = location.state.gameOverData;
        if(!gameOverData) {
            console.error("No gameOverData in state");
            navigate("/");
            return;
        }

        setGameData(gameOverData);
    }, []);


    return(
        <div className={`${style.PageOver} grid-fill`}>
            <h1>Game over!</h1>

            {!gameData ? "" : <>
                <ul className={style.dataContainer}>
                    <li>Difficulty: {gameData.difficulty}</li>
                    <li>Category: {gameData.categoryName}</li>
                    <li><h2>Score: {gameData.score}/{gameData.amount} ({Math.round(100*gameData.score/gameData.amount)}%)</h2></li>
                </ul>
                
            </>}
            
            <Link to="/"><Button text="Back to menu" /></Link>
        </div>
    )
}