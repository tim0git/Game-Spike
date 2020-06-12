import React from "react";

export default function GameStartComponent({
  name,
  language,
  handleSelectedLanguage,
  handleStart,
  enoughWordsToPlay,
}) {
  return (
    <div>
      <h3>Game {name}</h3>
      <p>Language: {language}</p>
      <label htmlFor="languages">Choose a language: </label>
      <select
        name="languages"
        onChange={(e) => handleSelectedLanguage(e)}
        default={"German"}
      >
        <option default value="German">
          German
        </option>
        <option value="French">French</option>
        <option value="Spanish">Spanish</option>
      </select>
      <br />
      {!enoughWordsToPlay && (
        <p>Translate more {language} words to play the game!</p>
      )}
      <button onClick={(e) => handleStart(e)} disabled={!enoughWordsToPlay}>
        Start
      </button>
    </div>
  );
}
