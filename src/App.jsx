import React, { useState } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";

export default function App() {
  const [isStart, setIsStart] = useState(true);

  function startGame() {
    setIsStart(false);
  }
  return (
    <div className="app__container">
      {isStart ? <StartScreen startGame={startGame} /> : <GameScreen />}
    </div>
  );
}
