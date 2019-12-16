import React from 'react';
import ReactDOM from 'react-dom';
import { MusicPlayer }  from './music_player.js';
import { LibraryList } from "./library_list.js";
import { MusicInfo } from "./music_info.js";
import { fetch_recommendation, fetch_library_songs } from "./util.js";
import './index.css';

class Square extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          value: null
      };
  }
  render() {
    return (
      <button className="square" onClick={()=>this.setState({ value: this.props.parent.state.player })} >
      { this.state.value }
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          player: "X"
      };
  }
  renderSquare(i) {
      console.log(<Square value={i} parent={this}/>);
    return <Square value={i} parent={this}/>;
  }

  render() {

    var innerDiv = [];
    for(var i = 0; i < 3; ++i) {
        var square = [];
        for(var o = 0; o < 3; ++o) {
            square.push(this.renderSquare(i*3 + o));
        }
        innerDiv.push(
            <div className="board-row">
                { square }
            </div>
        );
    }
    return (
      <div onClick={ ()=> this.setState({ player: (this.state.player === "X")? "O" : "X" }) }>
        <div className="status">{`Next player: ${this.state.player}`}</div>
        { innerDiv }
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

// ReactDOM.render(
//   <LibraryList title="recommendations" from="recommendations"/>,
//   document.getElementById("recommendations")
// );

ReactDOM.render(
  <LibraryList title="我的清單" from={fetch_library_songs}/>,
  document.getElementById("song_list")
);

ReactDOM.render(
  <MusicInfo />,
  document.getElementById("recommendations")
);

ReactDOM.render(
  <MusicPlayer />,
  document.getElementById('music_player')
);