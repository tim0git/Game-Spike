import "./App.css";
import Game from "./components/Game";
import React, { Component } from "react";

export default class App extends Component {
  state = {
    name: "testuser1",
    words: {
      German: [
        { cat: "die Katze" },
        { pig: "Schwein" },
        { sheep: "Schaf" },
        { cow: "Kuh" },
        { dog: "Hund" },
      ],
      French: [
        { cat: "le chat" },
        { pig: "truie" },
        { sheep: "brebis" },
        { cow: "vache" },
        { dog: "chien" },
      ],
      Spanish: [{ cat: "die Katze" }],
    },
  };
  render() {
    const { words, name } = this.state;
    return (
      <div className="App">
        <Game name={name} words={words} />
      </div>
    );
  }
}
