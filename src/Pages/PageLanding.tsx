
// packages
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

// components
import Button from "../Components/General/Button/Button"

// styles
import style from "./PageLanding.module.css";



export default function PageLanding() {
    const navigate = useNavigate();

    // form validity
    const formAmountRange = {min:1, max:50};
    const formDifficulties:string[] = ["any", "easy", "medium", "hard"];
    const formCategories:string[] = ["any"];
    const formTypes:string[] = ["any", "multiple", "boolean"];

    // form values
    const [formAmountValue, setformAmountValue] = useState<number>(10);
    const [formDifficultyValue, setFormDifficultyValue] = useState<string>("any");
    const [formCategoryValue, setFormCategoryValue] = useState<string>("any");
    const [formTypeValue, setFormTypeValue] = useState<string>("any");


    // form handling
    const handleformAmount = (event:ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        if(isNaN(parseInt(value))) {
            setformAmountValue(formAmountValue);
            return;
        }

        setformAmountValue(Math.min(Math.max(parseInt(event.target.value), formAmountRange.min), formAmountRange.max));
    }

    const handleFormDifficulty = (event: ChangeEvent<HTMLSelectElement>): void => {
        setFormDifficultyValue(event.target.value);
    }

    const handleFormCategory = (event: ChangeEvent<HTMLSelectElement>): void => setFormCategoryValue(event.target.value);

    const handleFormType = (event: ChangeEvent<HTMLSelectElement>): void => setFormTypeValue(event.target.value);

    const handleFormSubmit = (): void => {
        // validation
        const validate = (): boolean => {
            if(formDifficulties.indexOf(formDifficultyValue) === -1) return false;
            if(formCategories.indexOf(formCategoryValue) === -1) return false;
            if(formTypes.indexOf(formTypeValue) === -1) return false;

            if(formAmountValue<formAmountRange.min || formAmountValue>formAmountRange.max) return false;

            return true;
        }

        if(!validate()) {
            console.error("Form is invalid");
            return;
        }

        // request & redirect
        const requestData = {
            amount: formAmountValue,
            difficulty: formDifficultyValue,
            category: formCategoryValue,
            type: formTypeValue
        }

        navigate("/game", {state: {formData: requestData}});
    }


    // rendering
    return(
        <div className={style.PageLanding}>
            <form className={"grid-fill"}>
                <div className={style.inputsContainer}>
                    <label>
                        <span>Number of questions:</span>
                        <input type="number" name="number_questions" value={formAmountValue} onChange={handleformAmount}></input>
                    </label>

                    <label>
                        <span>Difficulty:</span>
                        <select name="difficulty" defaultValue={formDifficultyValue} onChange={handleFormDifficulty}>
                            <option value="any">Any difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>

                    <label>
                        <span>Category:</span>
                        <select name="category" defaultValue={formCategoryValue} onChange={handleFormCategory}>
                            <option value="any">Any category</option>
                        </select>
                    </label>

                    <label>
                        <span>Question Type:</span>
                        <select name="type" defaultValue={formTypeValue} onChange={handleFormType}>
                            <option value="any">Any type</option>
                            <option value="multiple">Multiple choice</option>
                            <option value="boolean">True / False</option>
                        </select>
                    </label>
                </div>

                <Button text="Start" onClick={handleFormSubmit} className={style.submit}/>
            </form>
        </div>
    )
}