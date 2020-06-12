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
    alertMessage: "",
  };

  componentDidMount = () => {
    this.getWord();
  };

  onTimeout = () => {
    setTimeout(() => {
      this.setState({ openAlert: false });
    }, 2000);
  };

  getRandomIndex = () => {
    const { words } = this.props;
    const { language } = this.state;
    const randomListItem = Math.floor(Math.random() * words[language].length);
    this.setState({ wordIndex: randomListItem });
    return randomListItem;
  };

  getWord = () => {
    const { words } = this.props;

    const { language } = this.state;

    const randomListItem = this.getRandomIndex();

    const word = `${Object.keys(words[language][randomListItem])}`;
    console.log(word);
    const transWord = `${Object.values(words[language][randomListItem])}`;

    this.setState((currentState) => {
      return {
        word: word,
        transWord: transWord,
        isLoading: !currentState.isLoading,
      };
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.word !== this.state.word) {
      this.getAssociatedWords();
    }
    if (
      prevState.wordIndex === this.state.wordIndex &&
      this.state.isLoading === true
    ) {
      console.log("wordIndex");
      this.setState({ isLoading: false });
    }
    if (prevState.language !== this.state.language) {
      this.getWord();
    }
    if (prevState.openAlert !== this.state.openAlert) {
      this.onTimeout();
    }
  };

  getAssociatedWords = () => {
    const { word } = this.state;
    const body = {
      text: word,
      lang: "en",
      filter: "noun",
    };
    axios
      .post("https://langsnap-be.herokuapp.com/api/associations/game", body)
      .then((res) => {
        const { wordsArray } = res.data.message;
        this.setState((currentState) => {
          return {
            associatedWords: [...wordsArray],
            isLoading: !currentState.isLoading,
          };
        });
      });
  };

  handleSelectedLanguage = (event) => {
    const { value } = event.target;
    this.setState({ language: value });
  };

  playGame = (e) => {
    const idTarget = e.target.id.toLowerCase();
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
    this.getWord();
  };

  handleStart = (e) => {
    this.setState({ isStarted: true });
  };

  resetIsStarted = () => {
    this.setState({ isStarted: false });
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
            resetIsStarted={this.resetIsStarted}
            openAlert={openAlert}
            alertMessage={alertMessage}
          />
        ) : (
          <GameStartComponent
            name={name}
            language={language}
            handleSelectedLanguage={this.handleSelectedLanguage}
            handleStart={this.handleStart}
            enoughWordsToPlay={enoughWordsToPlay}
          />
        )}
      </div>
    );
  }
}

// displaying same word twice..
// component updating errors mystery bug.

//Refactor at some point.
// sort array destructuring / data manipulation.
