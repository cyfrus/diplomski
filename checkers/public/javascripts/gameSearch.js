import React from 'react';
import ReactDOM from 'react-dom';

class SearchBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io('//localhost:3000'),
            games: [],
            
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick()
    {
        this.state.socket.emit('search', )
    }
    componentDidMount()
    {
        var object = this;
        this.state.socket.on('search', function (data) {
                this.setState({
                    games: this.state.games.push(data)
                })
          });
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick}> Search </button>
                <div>
                    {this.state.games}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <SearchBoard />, document.getElementById('gameboard')
);