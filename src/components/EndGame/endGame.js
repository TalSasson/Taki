import React from 'react';
import ReactDOM from 'react-dom';
import "./endGame.css";
import Logic from '../../logic.js';
import Statistics from '../Statistics/statistics';



export default class EndGame extends React.Component {

    
    render(){

        return(
            <div className={this.props.visible ? "endGame visibleEndGame" : "endGame"}>
                <div className="winner">{(this.props.winner === "user") ? "You Won!" : "Computer Won!"}</div>
                <Statistics info={this.props.statistics}/>
                <div className="btnWrapper">
                    <div className={this.props.visible ? "replay cursorVisible" : "replay"} onClick={this.props.onReplayClick}>
                        Replay
                    </div>
                    <div className={this.props.visible ? "startGame cursorVisible" : "startGame"} onClick={this.props.startGame}>
                        Start Game
                    </div>
                </div>
            </div>
        );
    }
}