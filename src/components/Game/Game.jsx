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
  };

  componentDidMount = () => {
    this.getWord();
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

    const word = Object.entries(words[language][randomListItem]).flat([1])[0];
    const transWord = Object.entries(words[language][randomListItem]).flat([
      1,
    ])[1];
    ///
    this.setState((currentState) => {
      return {
        word: word,
        transWord: transWord,
        isLoading: !currentState.isLoading,
      };
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log("updating");

    if (prevState.word !== this.state.word) {
      this.getAssociatedWords();
    }
    if (
      prevState.wordIndex === this.state.wordIndex &&
      this.state.isLoading === true
    ) {
      this.getWord();
    }
    if (prevState.language !== this.state.language) {
      this.getWord();
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
      .post("https://langsnap-be.herokuapp.com/api/associations", body)
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


// create new route & deploy backend to return the correct word in the array.

// component updating errors mystery bug.
// win loss components.

//Refactor at some point.
// sort array destructuring / data manipulation.