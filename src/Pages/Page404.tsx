
// packages
import { Link } from "react-router-dom";

// styles
import style from "./Page404.module.css";



export default function Page404() {
    return(
        <div className={style.Page404}>
            <div className={style.container}>
                <div>
                    <h1>404</h1>
                    <p>Not found :(</p>
                </div>
                <Link to="/"><button className={style.returnButton}>Back to landing page</button></Link>
            </div>
        </div>
    )
}