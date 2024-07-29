
// packages
import { Link } from "react-router-dom";

// styles
import style from "./Header.module.css"


export default function Header() {
    return(
        <header className={style.Header}>
            <Link to="/"><h1>SimplyTrivia</h1></Link>
        </header>
    )
}