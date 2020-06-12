import React, { Component } from "react";
import axios from "axios";
import GameStartComponent from "./GameStartComponent";
import GameRunning from "./GameRunning";

export default class Game extends Component {
  state = {
    language: "German",
    associatedWords: [],
    word: "",
    transWord: "",
    wordIndex: null,
    isLoading: false,
    isStarted: false,
    openAlert: false,
    alertMessage: null,
  };

  render() {
    const { name } = this.props;
    const {
      word,
      associatedWords,
      transWord,
      isLoading,
      isStarted,
      language,
      openAlert,
      alertMessage,
    } = this.state;
    const { words } = this.props;

    const enoughWordsToPlay = words[language].length >= 2;

    return (
      <div>
        {isStarted ? (
          <GameRunning
            isLoading={isLoading}
            transWord={transWord}
            associatedWords={associatedWords}
            word={word}
            playGame={this.playGame}
            resetIsStarted={this.changeIsStarted}
            openAlert={openAlert}
            alertMessage={alertMessage}
          />
        ) : (
          <GameStartComponent
            name={name}
            language={language}
            handleSelectedLanguage={this.handleSelectedLanguage}
            handleStart={this.changeIsStarted}
            enoughWordsToPlay={enoughWordsToPlay}
          />
        )}
      </div>
    );
  }

  componentDidMount = () => {
    this.getWord();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.word !== this.state.word) {
      this.getAssociatedWords();
    }

    if (prevState.language !== this.state.language) {
      this.getWord();
    }

    if (this.state.alertMessage !== null) {
      this.onTimeout();
    }
  };

  onTimeout = () => {
    setTimeout(() => {
      this.getWord();
    }, 2500);
  };

  // Extract to utils?
  getRandomIndex = () => {
    const { words } = this.props;
    const { language } = this.state;
    const wordsLength = words[language].length;
    let randomListItem = Math.floor(Math.random() * wordsLength);
    if (randomListItem === this.state.wordIndex) {
      if (randomListItem === wordsLength) {
        randomListItem--;
      } else {
        randomListItem++;
      }
    }
    if (wordsLength <= 1) {
      randomListItem = 0;
    }
    return randomListItem;
  };

  getWord = () => {
    const { words } = this.props;
    const { language } = this.state;
    const randomIndex = this.getRandomIndex();
    const word = `${Object.keys(words[language][randomIndex])}`;
    const transWord = `${Object.values(words[language][randomIndex])}`;

    this.setState((currentState) => {
      return {
        word: word,
        transWord: transWord,
        isLoading: !currentState.isLoading,
        wordIndex: randomIndex,
        openAlert: false,
        alertMessage: null,
      };
    });
  };

  // Extract to api file in Langsnap React app
  getAssociatedWords = () => {
    const { word } = this.state;
    const body = {
      text: word,
      lang: "en",
    };
    axios
      .post("https://langsnap-be.herokuapp.com/api/associations/game", body)
      .then(({ data: { message } }) => {
        const { wordsArray } = message;
        this.setState((currentState) => {
          return {
            associatedWords: [...wordsArray],
            isLoading: !currentState.isLoading,
          };
        });
      });
  };

  handleSelectedLanguage = ({ target }) => {
    const { value } = target;
    this.setState({ language: value });
  };

  playGame = ({ target }) => {
    const idTarget = target.id.toLowerCase();
    if (idTarget === this.state.word) {
      this.setState({
        openAlert: true,
        alertMessage: `${idTarget} well done!`,
      });
    } else {
      this.setState({
        openAlert: true,
        alertMessage: `${idTarget} wrong!`,
      });
    }
  };

  changeIsStarted = () => {
    this.setState((currentState) => {
      return { isStarted: !currentState.isStarted };
    });
  };
}

// displaying same word twice..
// component updating errors mystery bug.

//Refactor at some point.
// sort array destructuring / data manipulation.
