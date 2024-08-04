
// packages
import { useNavigate } from "react-router-dom";

// resources
import logoError from "../../../../../public/LogoNetworkError.svg"
import Button from "../../Button/Button";

// styles
import style from "./ErrorFallback.module.css";



export default function ErrorFallback({onExitCallback}:{onExitCallback?:Function}) {
    const navigate = useNavigate();

    const handleHomeButton = () => {
        if(onExitCallback) onExitCallback();
        navigate("/");
    };


    return (
        <div className={style.ErrorFallback}>
            <h1>Oops...</h1>
            <img className={style.logoError} src={logoError} />
            <p>Something bad happened :(</p>
            <Button onClick={handleHomeButton} text="Back to main menu"/>
        </div>
    )
}