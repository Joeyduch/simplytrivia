
// packages
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// components
import Button from "../Components/General/Button/Button"

// style
import style from "./PageOver.module.css";



type GameData = {
    amount: number,
    difficulty: string,
    category: string,
    type: string,
    score: number
}



export default function PageOver() {
    const location = useLocation();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState<GameData|null>(null);


    useEffect(() => {
        if(!location.state) {
            console.error("No state in location");
            navigate("/");
            return;
        }

        const gameOverData = location.state.gameOverData;
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
                    <li>Category: {gameData.category}</li>
                    <li>Type: {gameData.type}</li>
                </ul>
                <h2>Score: {gameData.score}/{gameData.amount} ({Math.round(100*gameData.score/gameData.amount)}%)</h2>
            </>}
            
            <Link to="/"><Button text="Back to menu" /></Link>
        </div>
    )
}