import "./App.css";
import Header from "./Header";
import Main from "./Components/Main";
import { useEffect } from "react";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import ProgressBar from "./Components/ProgressBar";
import FinishedScreen from "./Components/FinishedScreen";
import Timer from "./Components/Timer";
import { questionData } from "./data/ques";

const SECONDS = 30;

const initialState = {
  questions: [],
  // loading, error,ready,active,finished
  status: "loading",

  index: 0,

  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS,
      };

    case "newAnswer": {
      let currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    }
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highScore: state.highScore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("action Unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const numQuestions = state.questions.length;
  const maxPossiblePoints = state.questions.reduce(
    (prev, current) => prev + current.points,
    0
  );

  useEffect(function () {
    dispatch({ type: "dataReceived", payload: questionData.questions });
  }, []);

  return (
    <>
      <div className='app'>
        <Header />
        <Main>
          {state.status === "loading" && <Loader />}
          {state.status === "error" && <Error />}
          {state.status === "ready" && (
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          )}
          {state.status === "active" && (
            <>
              <ProgressBar
                index={state.index}
                numQuestions={numQuestions}
                points={state.points}
                maxPossiblePoints={maxPossiblePoints}
              />
              <Question
                question={state.questions[state.index]}
                dispatch={dispatch}
                answer={state.answer}
              />
              <footer>
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={state.secondsRemaining}
                />
                <NextButton
                  dispatch={dispatch}
                  answer={state.answer}
                  index={state.index}
                  numQuestions={numQuestions}
                />
              </footer>
            </>
          )}
          {state.status === "finished" && (
            <FinishedScreen
              points={state.points}
              maxPossiblePoints={maxPossiblePoints}
              highScore={state.highScore}
              dispatch={dispatch}
            />
          )}
        </Main>
      </div>
    </>
  );
}

export default App;
