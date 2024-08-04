
// packages
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"

// components
import Button from "../Components/General/Button/Button"
import LoadingScreen from "../Components/General/LoadingScreen/LoadingScreen";

// styles
import style from "./PageGame.module.css"



class Question {
    difficulty: string;
    category: string;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];

    constructor(questionJsonData?:any) {
        this.difficulty = questionJsonData && questionJsonData.difficulty || "Some difficulty";
        this.category = questionJsonData && questionJsonData.category || "Some category";
        this.question = questionJsonData && questionJsonData.question || "Some question";
        this.correctAnswer = questionJsonData && questionJsonData.correct_answer || "Correct Answer";
        this.incorrectAnswers = questionJsonData && questionJsonData.incorrect_answers || ["Incorrect A", "Incorrect B"];

        this.parseHTML();
    }

    parseHTML = () => {
        const parser = new DOMParser();

        let doc = parser.parseFromString(this.category, "text/html");
        let text = doc.body.textContent || ""
        this.category = text;

        doc = parser.parseFromString(this.question, "text/html");
        text = doc.body.textContent || ""
        this.question = text;
        
        doc = parser.parseFromString(this.correctAnswer, "text/html");
        text = doc.body.textContent || ""
        this.correctAnswer = text;

        for(let i=0; i<this.incorrectAnswers.length; i++) {
            doc = parser.parseFromString(this.incorrectAnswers[i], "text/html");
            text = doc.body.textContent || ""
            this.incorrectAnswers[i] = text;
        }
    }
}



type GameSettings = {
    amount: number,
    difficulty: string,
    category: string,
}



export default function PageGame() {
    const location = useLocation();
    const navigate = useNavigate();

    const answersButtonContainerElement = useRef(null);

    const [score, setScore] = useState<number>(0);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);

    const [gameSettings, setGameSettings] = useState<GameSettings|null>(null);

    const [questionsList, setQuestionsList] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question|null>(null);
    const [answersList, setAnswersList] = useState<string[]>([]);


    // methods
    const tryFetch = async (url:string, tries:number=1) => {
        console.warn(`** fetching try #${tries} **`);
        if(tries >= 8) {
            console.error("Max tries reached, exiting back to main menu");
            navigate("/");
            return;
        }
        
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.response_code != 0) {
                throw("invalid response code");
            }

            setCurrentQuestionIndex(0);
            setQuestionsList(data.results);
        })
        .catch(err => {
            console.error(err);
            
            setTimeout(() => {
                if(questionsList.length === 0) tryFetch(url, tries+1);
            }, 2000);
        });
    }

    // buttons handlers
    const handleAnswerButton = (chosenAnswer:string) => {
        if(isRevealed) return;

        if(chosenAnswer===currentQuestion?.correctAnswer) setScore(s => s+1);

        // set CSS
        console.log(`-> -----------------`)
        let buttonsContainerElement:HTMLDivElement = answersButtonContainerElement.current ? answersButtonContainerElement.current : new HTMLDivElement();
        for(const element of buttonsContainerElement.children) {
            element.innerHTML === currentQuestion?.correctAnswer ? element.classList.add(style.correct) : element.classList.add(style.incorrect);
            element.innerHTML === chosenAnswer ? element.classList.add(style.chosen) : element.classList.remove(style.chosen);
            console.log(`-> innerHTML: ${element.innerHTML}`);
        }
        console.log(`-> correct answer: ${currentQuestion?.correctAnswer}`);
        console.log(`-> chosen answer: ${chosenAnswer}`);

        setIsRevealed(true);
    }

    const handleNextButton = () => {
        if(currentQuestionIndex >= questionsList.length-1) {
            const finalData = {... gameSettings, score:score};
            navigate("/over", {state: {gameOverData: finalData}});
        }

        // reset buttons CSS
        let buttonsContainerElement:HTMLDivElement = answersButtonContainerElement.current ? answersButtonContainerElement.current : new HTMLDivElement();
        for(const element of buttonsContainerElement.children) {
            element.classList.remove(style.correct);
            element.classList.remove(style.incorrect);
            element.classList.remove(style.chosen);
        }

        setCurrentQuestionIndex(i => i+1)
        setIsRevealed(false);
    }


    // UseEffects

    // On mount -> validate & update game settings
    useEffect(() => {
        // validate
        if(!location.state) {
            console.error("No state in location");
            navigate("/");
        }

        const formData = location.state.formData;
        if(!formData) {
            console.error("No data to fetch");
            navigate("/");
        }

        const newGameSettings:GameSettings = {
            amount: formData.amount,
            difficulty: formData.difficulty,
            category: formData.category,
        }
        
        setGameSettings(newGameSettings);
    }, []);

    // On gameSettings updated -> fetch question list data from API
    useEffect(() => {
        if(!gameSettings) return;

        let requestUrl:string = `https://opentdb.com/api.php?amount=${gameSettings.amount}`;
        if(gameSettings.difficulty != "any") requestUrl += `&difficulty=${gameSettings.difficulty}`;
        if(gameSettings.category != "any") requestUrl += `&category=${gameSettings.category}`;

        console.info("-- fetching --");
        tryFetch(requestUrl);
    }, [gameSettings])

    // set new current question
    useEffect(() => {
        const question:Question = new Question(questionsList[currentQuestionIndex]);
        setCurrentQuestion(question);
    }, [questionsList, currentQuestionIndex]);

    // set new answers list
    useEffect(() => {
        const answers:string[] = currentQuestion ? [... currentQuestion.incorrectAnswers, currentQuestion.correctAnswer] : [];

        // shuffle
        for(let i=0; i<answers.length; i++) {
            const randomIndex = Math.floor(Math.random() * answers.length);
            [answers[i], answers[randomIndex]] = [answers[randomIndex], answers[i]];
        }

        setAnswersList([... answers]);
    }, [currentQuestion]);


    // Render
    return(
        <div className={`${style.PageGame} grid-fill`}>
            {questionsList.length===0 || !currentQuestion ? <LoadingScreen text="Fetching Data" /> : <>
                <div className={style.infoContainer}>
                    <h2>{currentQuestion.category}</h2>
                    <p>{currentQuestion.difficulty[0].toUpperCase() + currentQuestion.difficulty.slice(1)}</p>
                </div>

                <div className={style.infoContainer}>
                    <p>Round: {currentQuestionIndex+1}/{questionsList.length}</p>
                    <p>Score: {score}</p>
                </div>
                

                <div className={style.questionContainer}>
                    <p className={style.question}>{currentQuestion.question}</p>
                    <div className={style.answersContainer} ref={answersButtonContainerElement}>
                        {answersList.map((answer, index) => <Button
                            key={index}
                            onClick={() => handleAnswerButton(answer)}
                            text={answer}
                        />)}
                    </div>
                </div>

                {isRevealed ? <Button className={style.nextQuestionButton} text="Next" onClick={handleNextButton} /> : ""}
            </>}
            
        </div>
    )
}