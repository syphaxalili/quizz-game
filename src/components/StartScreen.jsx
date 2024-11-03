import React from "react";
import BgLeft from "../assets/bg-blue.png";
import BgRight from "../assets/bg-yellow.png";

const StartScreen = (props) => {
  return (
    <div className="startscreen__container screen">
      <img src={BgLeft} className="bg__left" alt="background effect" />
      <img src={BgRight} className="bg__right" alt="background effect" />
      <div className="startscreen__content content">
        <h2>Quizzical</h2>
        <p>Welcome to our amazing game!</p>
        <button className="action__button" onClick={props.startGame}>
          Start quiz
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
