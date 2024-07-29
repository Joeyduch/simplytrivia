
// styles
import style from "./Button.module.css"



export default function Button({text, onClick, className}:{text:string, onClick?:any, className?:any}) {
    return(
        <button className={`${style.Button} ${className?className:""}`} type="button" data-text={text} onClick={onClick}>{text}</button>
    )
}