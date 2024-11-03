import React, { useState, useEffect } from "react";
import BgLeft from "../assets/bg-blue.png";
import BgRight from "../assets/bg-yellow.png";
import he from "he";

const GameScreen = () => {
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsObjects, setQuestionsObjects] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const NUMBER_OF_QUESTIONS_IN_GAME = 5;

  // Make an API call to get data from web
  function getQuestionsFromOTDB() {
    fetch(
      `https://opentdb.com/api.php?amount=${NUMBER_OF_QUESTIONS_IN_GAME}&difficulty=easy&type=multiple`
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Failed to fetch data.");
        }
      })
      .then((data) => {
        setQuestionsList(data.results);
      });
  }
  useEffect(() => {
    getQuestionsFromOTDB();
  }, []);

  // Turn received data to objects [Needed for App logic]
  function questionsToObjects(questionsList) {
    return questionsList.map((question, index) => {
      return {
        id: "question" + (index + 1),
        // Decode question before assigning it to the object
        text: he.decode(question.question),
        answer: question["correct_answer"],
        options: [
          { text: he.decode(question["correct_answer"]), isChecked: false },
          ...question["incorrect_answers"].map((option) => {
            return { text: he.decode(option), isChecked: false };
          }),
        ].sort(),
      };
    });
  }
  useEffect(() => {
    if (questionsList.length > 0) {
      setQuestionsObjects(questionsToObjects(questionsList));
      setLoading(false);
    }
  }, [questionsList]);

  // Can select only one option for each question
  function handleOptionClick(questionIndex, optionIndex) {
    setQuestionsObjects((oldOjbects) => {
      console.log(oldOjbects);
      return oldOjbects.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          // Create a new array for options with the updated isChecked status
          const updatedOptions = question.options.map((option, oIdx) => ({
            ...option,
            isChecked: oIdx === optionIndex,
          }));

          return {
            ...question,
            options: updatedOptions,
          };
        }
        return question;
      });
    });
  }

  function countCorrectAnswers() {
    let counter = 0;
    questionsObjects.forEach((question) => {
      const correctAnswer = question.answer;
      question.options.forEach((option) => {
        if (option.isChecked) {
          if (option.text === correctAnswer) {
            counter++;
          }
        }
      });
    });
    return counter;
  }

  function countAnsweredQuestions() {
    let counter = 0;
    questionsObjects.forEach((question) => {
      question.options.forEach((option) => {
        if (option.isChecked) {
          counter++;
          return;
        }
      });
    });
    return counter;
  }

  function handleShowResults() {
    if (countAnsweredQuestions() === NUMBER_OF_QUESTIONS_IN_GAME) {
      setIsPlaying(false);
    }
  }

  function handlePlayAgain() {
    setLoading(true); // Set loading to true while loading new questions
    getQuestionsFromOTDB(); // Fetch new questions
    setIsPlaying(true); // Reset the game state
  }

  // Check if all questions have been answered
  const allQuestionsAnswered =
    countAnsweredQuestions() === NUMBER_OF_QUESTIONS_IN_GAME;

  const questionsElements = questionsObjects.map((question, qIndex) => {
    const questionText = question.text;
    const questionOptions = question.options;
    return (
      <div className="question" key={qIndex}>
        <h3 className="text">{questionText}</h3>
        <div className="options__container">
          {questionOptions.map((option, oIndex) => {
            // Determine the class based on answer correctness and if the game is over
            let optionClass = "option";
            if (!isPlaying) {
              if (option.text === question.answer) {
                optionClass += " correct";
              } else if (option.isChecked) {
                optionClass += " incorrect";
              }
            } else if (option.isChecked) {
              optionClass += " checked";
            }

            return (
              <div
                className={optionClass}
                key={oIndex}
                onClick={() => {
                  if (isPlaying) handleOptionClick(qIndex, oIndex);
                }}
              >
                <span>{option.text}</span>
              </div>
            );
          })}
        </div>
        <hr />
      </div>
    );
  });

  return (
    <div className="gamescreen__container screen">
      <img src={BgLeft} className="bg__left" alt="background effect" />
      <img src={BgRight} className="bg__right" alt="background effect" />
      <div className="gamescreen__content content">
        {loading ? (
          <p className="loading__text">Loading questions...</p>
        ) : (
          <div>
            <div className="questions__container">{questionsElements}</div>
            <div className="result__button-container">
              {isPlaying ? (
                <button
                  className="check__answers action__button"
                  onClick={handleShowResults}
                  disabled={!allQuestionsAnswered} // Disable button if not all questions are answered
                >
                  Check answers
                </button>
              ) : (
                <div className="result__container">
                  <p>{`You scored ${countCorrectAnswers()}/${NUMBER_OF_QUESTIONS_IN_GAME} correct answers`}</p>
                  <button
                    className="check__answers action__button"
                    onClick={handlePlayAgain}
                  >
                    Play again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;