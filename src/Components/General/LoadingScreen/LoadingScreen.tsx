
// styles
import style from "./LoadingScreen.module.css"

// components
import Spinner from "../Spinner/Spinner"


export default function LoadingScreen({text}:{text?:string}) {
    return(
        <div className={style.LoadingScreen}>
            <div>
                <h1>Loading</h1>
                {text ? <p>{text}</p> : ""}
            </div>
            
            <Spinner />
        </div>
    )
}