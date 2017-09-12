import React from 'react';
import ReactDOM from 'react-dom';

var socket = io('//localhost:3000');

function Square(props) {
  function getClassName() {
    var className = "square ";
    props.selected ? className = className + "selected " : className = className + "";
    props.available ? className = className + "available" : className = className + "";
    props.brown ? className = className + " brown" : "";
    return className;
  }
  if (props.value) {
    return (

      <button className={getClassName()} onClick={props.onClick}>
        <span className={"player" + props.value}>
          {props.available}
        </span>
      </button>
    );
  }
  else {
    return (
      <button className={getClassName()} onClick={props.onClick}>
      </button>
    );
  }


}

class Board extends React.Component {
 
  checkAvailable(i) {
    var isAvailable = false;
    this.props.moves.forEach(function (element) {
      if (element === i) {
        isAvailable = true;
        return;
      }
    });
    return isAvailable;
  }
  renderSquare(i) {
    return (
      <Square brown={this.props.brown[i]} available={this.props.moves.length !== 0 ? this.checkAvailable(i) : false} selected={this.props.selected === i ? true : false}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div className="col board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
        <div className="board-row">
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
        </div>
        <div className="board-row">
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
          {this.renderSquare(27)}
          {this.renderSquare(28)}
          {this.renderSquare(29)}
          {this.renderSquare(30)}
          {this.renderSquare(31)}
        </div>
        <div className="board-row">
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
          {this.renderSquare(35)}
          {this.renderSquare(36)}
          {this.renderSquare(37)}
          {this.renderSquare(38)}
          {this.renderSquare(39)}
        </div>
        <div className="board-row">
          {this.renderSquare(40)}
          {this.renderSquare(41)}
          {this.renderSquare(42)}
          {this.renderSquare(43)}
          {this.renderSquare(44)}
          {this.renderSquare(45)}
          {this.renderSquare(46)}
          {this.renderSquare(47)}
        </div>
        <div className="board-row">
          {this.renderSquare(48)}
          {this.renderSquare(49)}
          {this.renderSquare(50)}
          {this.renderSquare(51)}
          {this.renderSquare(52)}
          {this.renderSquare(53)}
          {this.renderSquare(54)}
          {this.renderSquare(55)}
        </div>
        <div className="board-row">
          {this.renderSquare(56)}
          {this.renderSquare(57)}
          {this.renderSquare(58)}
          {this.renderSquare(59)}
          {this.renderSquare(60)}
          {this.renderSquare(61)}
          {this.renderSquare(62)}
          {this.renderSquare(63)}
        </div>

      </div>
    );
  }
}

class Counter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {seconds: 10};
  }
  
  componentDidMount() {
    setInterval(() => {
      if(this.state.seconds)
      {
        this.setState({ seconds: this.state.seconds - 1 })
      }
      else
      {
        this.setState({ seconds: 10})
      }
     }, 1000);
   }

   render(){
      return(
        <div>
           Timer: {this.state.seconds}
        </div>
      )
   }
}
class ChatList extends React.Component{
   render()
   {  
      const texts = this.props.texts;
      const textList = texts.map((text, index) =>
       <div key={index}>{text}</div>
    );
     return(
      <div className="chatlist-div">
      <div className="chatlist float-left">{textList}</div>
      </div>
     );
   }
}
class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
       text: [],
       current: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {    
    socket.on('chat message', data => {
      var texts = this.state.text;
      texts.push(data);
      this.setState({ text: texts})
    }) 
  }

  handleChange(event)
  {
      this.setState({
        current: event.target.value
      })
  }
  handleClick(event) {
    socket.emit('chat message', this.state.current);
    this.setState({
      current: ""
    }) 
  }
    render()
    {
      
      return(
        <div>
        <ChatList texts={this.state.text} />
        <div className="form-group">
        <label>
          Message:
          </label>
          <input type="text" value={this.state.current} onChange={this.handleChange} className="form-control" />
          <button type="button" className="btn btn-dark sendtextbtn" onClick={this.handleClick}>Send</button>
        </div>
        </div>
      );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: "red",
      squares: Array(64).fill(""),
      selected: null,
      moves: [],
      brown: Array(64).fill(),
      deleted: []
    };

  }
  componentWillMount() {
    const squares = this.state.squares.slice();
    const browns = this.state.brown.slice();
    var seconds = 10;
    squares[1] = squares[3] = squares[5] = squares[7] = squares[8] = squares[10] = squares[12] = squares[14] = squares[17] = squares[19] = squares[21] = squares[23] = "black";
    squares[40] = squares[42] = squares[44] = squares[46] = squares[49] = squares[51] = squares[53] = squares[55] = squares[56] = squares[58] = squares[60] = squares[62] = "red";
    var isbrown = false;
    var cnt = 1;
    for (var index = 0; index < 64; index++) {
      browns[index] = isbrown;
      if (cnt === 8) {
        cnt = 1;
      }
      else {
        isbrown = !isbrown;
        cnt++;
      }
    }

    this.setState({
      squares: squares,
      brown: browns,
    })
  }
  increment(seconds)
  {
      seconds -= 1;
      return seconds;
  }
  handleClick(i) {
    socket.emit('move', this.state.squares); 
    const squares = this.state.squares.slice();
    const selected = [];
    selected.push(i);
    if (this.state.selected && this.state.moves.indexOf(i) !== -1) {
      squares[this.state.selected] = "";
      squares[i] = this.state.turn;
      this.state.deleted.forEach(function(element){
        squares[element] = "";
      })
      
      this.setState({
        squares: squares,
        turn: this.state.turn === "black" ? "red" : "black",
        selected: null,
        moves: []
      })
    }
    else if (this.state.squares[i] == this.state.turn) {
      this.setState({
        selected: i,
        moves : this.availableMoves(squares, this.state.turn, selected)
      });
      
    }

  }
  gameOver()
  {
     var pieces = [];
     var turn = this.state.turn;
     this.state.squares.forEach(function(element, index){
       if(element === turn)
       {
          pieces.push(index);
       }
     })
     this.availableMoves(this.state.squares, turn, pieces);
     
  }
  availableMoves(squares, turn, selected) {
    var moves = [];
    var edge1 = [0, 8, 16, 24, 32, 40, 48, 56];
    var edge2 = [7, 15, 23, 31, 39, 47, 55];
    var deleted = [];
    var object = this;
    selected.forEach(function(checker)
    {
      if (checker && turn === "red") {
        if(edge1.indexOf(checker) === -1 && squares[checker - 7] === "" && squares[checker - 9] === "" && edge2.indexOf(checker) === -1)
          {
            moves.push(checker - 9, checker - 7);
          }
        else if(edge1.indexOf(checker) === -1 && squares[checker - 9] === "")
          {
            moves.push(checker - 9);
          }
        else if(edge2.indexOf(checker) === -1 && squares[checker - 7] === "")
          {
            moves.push(checker - 7);
          }
      }
      else if (checker && turn == "black") {
        if(edge1.indexOf(checker) === -1  && squares[checker + 9] === "" && squares[checker + 7] === "" && edge2.indexOf(checker) === -1)
          {
            moves.push(checker + 9, checker + 7);
          }
        else if(edge1.indexOf(checker) === -1  && squares[checker + 7] === "")
          {
            moves.push(checker + 7);
          }
        else if(squares[checker + 9] === "" && edge2.indexOf(checker) === -1)
          {
            moves.push(checker + 9);
          }
      }
      object.checkJumps(moves, squares, checker, deleted);
    })
    
    
    this.setState({
      deleted : deleted
    })
    return moves;    
  }

  componentDidMount()
  {
    socket.on('move', data => {
      var squares = this.state.squares;
      this.setState({ squares: squares})
    }) 
  }
  checkJumps(moves, squares, selected, deleted)
  {

    var edge1 = [0, 8, 16, 24, 32, 40, 48, 56];
    var edge2 = [7, 15, 23, 31, 39, 47, 55];

      if(squares[selected - 9] === "black" && squares[selected - 18] === "" && squares[selected - 7] === "black" && squares[selected - 14] === "" && this.state.turn === "red" && edge1.indexOf(selected) === -1 && edge2.indexOf(selected) === -1)
        {
           moves.push(selected - 18, selected - 14);
           deleted.push(selected - 18);
           this.checkJumps(moves, squares, selected - 18, deleted);
        }
      else if(squares[selected - 9] === "black" && squares[selected - 18] === "" && this.state.turn === "red" && edge1.indexOf(selected) === -1)
        {
           moves.push(selected - 18);
           deleted.push(selected - 9);
           this.checkJumps(moves, squares, selected - 18, deleted);
        }
      else if(squares[selected - 7] === "black" && squares[selected - 14] === "" && this.state.turn === "red" && edge2.indexOf(selected) === -1)
       {
          moves.push(selected - 14); 
          deleted.push(selected - 7);
          this.checkJumps(moves, squares, selected - 14, deleted);
       }
      else if(squares[selected + 9] === "red" && squares[selected + 18] === "" && squares[selected + 7] === "red" && squares[selected + 14] === "" && this.state.turn === "black" && edge1.indexOf(selected) === -1 && edge2.indexOf(selected) === -1)
      {
          moves.push(selected + 18, selected + 14);
          deleted.push(selected + 14);
          this.checkJumps(moves, squares, selected - 14, deleted);
      }
      else if(squares[selected + 9] === "red" && squares[selected + 18] === ""  && this.state.turn === "black" && edge2.indexOf(selected) === -1)
      {
          moves.push(selected + 18);
          deleted.push(selected + 9);
          this.checkJumps(moves, squares, selected + 18, deleted);
      }
      else if(squares[selected + 7] === "red" && squares[selected + 14] === "" && this.state.turn === "black" && edge1.indexOf(selected) === -1)
      {
         moves.push(selected + 14);
         deleted.push(selected + 7);
         this.checkJumps(moves, squares, selected + 14, deleted);
      }
      else
      {
        return;
      }
       
  }
  render() {
    return (
      <div className="row">
        <div className="player col">
          {"Player: " + this.state.turn}
          <Counter />
        </div>
        
        <div className="col-md-auto">
        <Board brown={this.state.brown} moves={this.state.moves} squares={this.state.squares} selected={this.state.selected} onClick={i => this.handleClick(i)} />
        </div>
        <div className="col">
        <Chat />
        </div> 
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
