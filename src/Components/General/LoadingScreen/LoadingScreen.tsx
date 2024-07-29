
// styles
import style from "./LoadingScreen.module.css"


export default function LoadingScreen({text}:{text:string}) {
    return(
        <div className={style.LoadingScreen}>
            <h1>Loading...</h1>
            <p>{text}</p>
        </div>
    )
}