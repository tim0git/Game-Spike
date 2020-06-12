import React from "react";

export default function GameRunning({
  isLoading,
  transWord,
  word,
  associatedWords,
  playGame,
  resetIsStarted,
}) {
  const Loading = <>Loading...</>;
  return (
    <div>
      <p>The word is {transWord}</p>
      <p> tim's little helper {word}</p>
      {isLoading ? (
        Loading
      ) : (
        <>
          {associatedWords.map((wordObj) => {
            return (
              <div key={wordObj.item}>
                <input
                  type="radio"
                  id={wordObj.item}
                  name={wordObj.item}
                  value={wordObj.item}
                  onClick={(e) => playGame(e)}
                />
                <span>{wordObj.item}</span>
              </div>
            );
          })}
        </>
      )}
      <br/>
      <button onClick={(e) => resetIsStarted(e)}>Select Language</button>
    </div>
  );
}
