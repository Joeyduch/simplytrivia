
// packages
import { Link } from "react-router-dom"

// styles
import style from "./Footer.module.css";

export default function Footer() {
    return(
        <footer className={style.Footer}>
            <Link to="https://joey-ducharme.netlify.app/" target="_blank"><span>© Joey Ducharme</span></Link>
        </footer>
    )
}