import React, { Component } from "react";
import axios from "axios";

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
        isLoading: true,
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
            isLoading: false,
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

  render() {
    const { name } = this.props;
    const {
      word,
      associatedWords,
      transWord,
      isLoading,
      language,
    } = this.state;
    const Loading = <>Loading...</>;
    return (
      <div>
        <h3>Game {name}</h3>
        <p>Language: {language}</p>
        <select onChange={this.handleSelectedLanguage}>
          <option default value="">
            Please select from below...
          </option>
          <option default value="German">
            German
          </option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
        <p>The word is {transWord}</p>
        <p> tim's little helper {word}</p>
        {isLoading
          ? Loading
          : associatedWords.map((wordObj) => {
              return (
                <div key={wordObj.item}>
                  <input
                    type="radio"
                    id={wordObj.item}
                    name={wordObj.item}
                    value={wordObj.item}
                    onClick={(e) => this.playGame(e)}
                  />
                  <span>{wordObj.item}</span>
                </div>
              );
            })}
      </div>
    );
  }
}

// sort one word list with a conditional render
// sort array destructuring / data manipulation.
// create new route & deploy backend to return the correct word in the array.
