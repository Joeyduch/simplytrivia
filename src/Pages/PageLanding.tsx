
// packages
import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// classes
import { GameSettings } from "../Classes/GameData";

// components
import Button from "../Components/General/Button/Button"

// styles
import style from "./PageLanding.module.css";



/*
    TYPES / INTERFACES
*/

// Categories
interface FetchedCategories {
    trivia_categories: CategoryList
}
interface CategoryCount {
    category_id: number,
    category_question_count: {
        total_easy_question_count: number,
        total_medium_question_count: number,
        total_hard_question_count: number,
        total_question_count: number,
    }
}

interface Category {
    id:number,
    name:string
};

type CategoryList = Array<Category>;

// Themes
interface Theme {
    name:string,
    huePrimary: string,
    hueSecondary: string,
    hueRight: string,
    hueWrong: string
}



/*
    GLOBALS
*/

const themes:Theme[] = [
    {
        name: "Default",
        huePrimary: "285",
        hueSecondary: "195",
        hueRight: "125",
        hueWrong: "350"
    },
    {
        name: "Inverted",
        huePrimary: "195",
        hueSecondary: "285",
        hueRight: "125",
        hueWrong: "350"
    },
    {
        name: "Summer",
        huePrimary: "25",
        hueSecondary: "325",
        hueRight: "125",
        hueWrong: "325"
    },
    {
        name: "Winter",
        huePrimary: "175",
        hueSecondary: "205",
        hueRight: "150",
        hueWrong: "300"
    },
    {
        name: "Forest",
        huePrimary: "110",
        hueSecondary: "150",
        hueRight: "125",
        hueWrong: "15"
    },
    {
        name: "Alien",
        huePrimary: "300",
        hueSecondary: "150",
        hueRight: "150",
        hueWrong: "300"
    },
    {
        name: "Golden",
        huePrimary: "50",
        hueSecondary: "25",
        hueRight: "125",
        hueWrong: "350"
    }
]



/*
    COMPONENT
*/

export default function PageLanding() {
    const navigate = useNavigate();

    // form validity
    const formValidityAmountRange = {min:0, max:50};
    const formValidityDifficulties:string[] = ["any", "easy", "medium", "hard"];
    const [formValidityCategories, setFormValidityCategories] = useState<string[]>(["any"]);

    // form values
    const [formAmountValue, setformAmountValue] = useState<number>(10);
    const [formDifficultyValue, setFormDifficultyValue] = useState<string>("any");
    const [formCategoryValue, setFormCategoryValue] = useState<string>("any");
    const [formThemeValue, setFormThemeValue] = useState<string>("0");

    const [categoryList, setCategoryList] = useState<CategoryList|null>(null);
    const [categoryCount, setCategoryCount] = useState<CategoryCount|null>(null);


    // ------------------
    // form handlers

    const handleformAmount = (event:ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        if(isNaN(parseInt(value))) {
            setformAmountValue(formValidityAmountRange.min);
            return;
        }

        setformAmountValue(Math.min(Math.max(parseInt(event.target.value), formValidityAmountRange.min), formValidityAmountRange.max));
    }

    const handleFormDifficulty = (event: ChangeEvent<HTMLSelectElement>): void => setFormDifficultyValue(event.target.value);

    const handleFormCategory = (event: ChangeEvent<HTMLSelectElement>): void => setFormCategoryValue(event.target.value);

    const handleFormTheme = (event: ChangeEvent<HTMLSelectElement>): void => {
        const newValue = event.target.value
        setFormThemeValue(newValue);
        localStorage.setItem("theme", newValue);
    }

    const handleFormSubmit = (): void => {
        // validation
        const validate = (): boolean => {
            if(formValidityDifficulties.indexOf(formDifficultyValue) === -1) return false;
            if(formValidityCategories.indexOf(formCategoryValue) === -1) return false;

            if(formAmountValue<formValidityAmountRange.min || formAmountValue>formValidityAmountRange.max) return false;

            return true;
        }

        if(!validate()) {
            console.error("Form is invalid");
            return;
        }

        // get category name
        let newCategoryName = "any";
        if(formCategoryValue!=="any" && categoryList) {
            const indexOffset = parseInt(formCategoryValue) - categoryList[0].id; // because ids doesnt match the array index
            newCategoryName = categoryList[indexOffset].name;
        }

        // request & redirect
        const gameSettingsRequestData:GameSettings = {
            amount: !formAmountValue ? 1 : formAmountValue,
            difficulty: formDifficultyValue,
            category: formCategoryValue,
            categoryName: newCategoryName,
        }

        navigate("/game", {state: {formData: gameSettingsRequestData}});
    }

    // ------------------
    // Fetching functions

    const fetchCategories = () => {
        return new Promise<FetchedCategories>((resolve, reject) => {
            fetch("https://opentdb.com/api_category.php")
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    const fetchCategoryCount = (categoryId:string) => {
        return new Promise<CategoryCount>((resolve, reject) => {
            fetch(`https://opentdb.com/api_count.php?category=${categoryId}`)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }


    // ------------------
    // UseEffects

    // fetch categories 
    useEffect(() => {
        fetchCategories()
            .then(data => {
                setCategoryList([... data.trivia_categories]);
            })
            .catch(error => console.info(error));
    }, []);

    // add categories to form validity
    useEffect(() => {
        if(!categoryList) return;
        console.log("- Update Category List -");

        const newCategories = [];
        for(const category of categoryList) {
            newCategories.push(category.id.toString())
        }

        setFormValidityCategories(["any", ... newCategories]);
    }, [categoryList]);

    // make sure we dont ask for more questions than there are available
    useEffect(() => {
        if(formCategoryValue === "any") {
            setCategoryCount(null);
            return;
        }
        
        fetchCategoryCount(formCategoryValue)
            .then(data => {
                setCategoryCount(data);
            })
            .catch(error => {
                console.info("Error fetching category count");
                console.error(error);
            });

    }, [formCategoryValue])

    useEffect(() => {
        if(!categoryCount) {
            console.info("No categoryCount fetched");
            return;
        }

        let finalAmountValue = formAmountValue;
        switch(formDifficultyValue) {
            case "any":
                finalAmountValue = Math.min(finalAmountValue, categoryCount.category_question_count.total_question_count);
                break;
            case "easy":
                finalAmountValue = Math.min(finalAmountValue, categoryCount.category_question_count.total_easy_question_count);
                break;
            case "medium":
                finalAmountValue = Math.min(finalAmountValue, categoryCount.category_question_count.total_medium_question_count);
                break;
            case "hard":
                finalAmountValue = Math.min(finalAmountValue, categoryCount.category_question_count.total_hard_question_count);
                break;
        }

        setformAmountValue(finalAmountValue);

    }, [categoryCount, formDifficultyValue, formAmountValue])

    // load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setFormThemeValue(savedTheme ? savedTheme : formThemeValue);
    }, []);

    // change theme
    useEffect(() => {
        const newTheme:Theme = themes[parseInt(formThemeValue)];
        document.documentElement.style.setProperty("--color-primary-hue", newTheme.huePrimary);
        document.documentElement.style.setProperty("--color-secondary-hue", newTheme.hueSecondary);
        document.documentElement.style.setProperty("--color-right-hue", newTheme.hueRight);
        document.documentElement.style.setProperty("--color-wrong-hue", newTheme.hueWrong);
    }, [formThemeValue]);


    // ------------------
    // rendering

    return(
        <div className={style.PageLanding}>
            <form className={"grid-fill"}>
                <div className={style.inputsContainer}>
                    <label>
                        <span>Number of questions</span>
                        <input type="number" name="number_questions" value={formAmountValue} onChange={handleformAmount}></input>
                    </label>

                    <label>
                        <span>Category</span>
                        <select name="category" defaultValue={formCategoryValue} onChange={handleFormCategory}>
                            <option value="any">Any category</option>
                            {!categoryList ? "" : categoryList.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                        </select>
                    </label>

                    <label>
                        <span>Difficulty</span>
                        <select name="difficulty" defaultValue={formDifficultyValue} onChange={handleFormDifficulty}>
                            <option value="any">Any difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    
                    <label>
                        <span>Theme</span>
                        <select name="difficulty" defaultValue={localStorage.getItem("theme") || formThemeValue} onChange={handleFormTheme}>
                            {themes.map((value, index) =>
                                <option key={index} value={index}>{value.name}</option>
                            )}
                            
                        </select>
                    </label>
                </div>

                <Button text="Start" onClick={handleFormSubmit} className={style.submit}/>
            </form>
        </div>
    )
}