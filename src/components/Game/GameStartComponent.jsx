import React from "react";

export default function GameStartComponent({
  name,
  language,
  handleSelectedLanguage,
  handleStart,
}) {
  return (
    <div>
      <h3>Game {name}</h3>
      <p>Language: {language}</p>
      <label htmlFor="languages">Choose a language:  </label>
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
      {language === "Spanish" && (
        <p>
          You must have more than two words translated in {language} to play the
          game
        </p>
      )}
      <button onClick={(e) => handleStart(e)} disabled={language === "Spanish"}>
        Start
      </button>
    </div>
  );
}
