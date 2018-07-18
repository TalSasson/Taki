import React from 'react';
import ReactDOM from 'react-dom';
import "./replayArrows.css";
import Logic from '../../logic.js';


export default class ReplayArrows extends React.Component {

    render(){

        return(
            <div className={this.props.visible ? "arrowsWrapper visible" : "arrowsWrapper"}>
                <div className="arrows">
                    <div className={this.props.visible ? "leftArrow cursorPointer" : "leftArrow"} onClick={this.props.onLeftClick}></div>
                    <div className={this.props.visible ? "startGame cursorVisible" : "startGame"} onClick={this.props.startGame}>
                        Start Game
                    </div>
                    <div className={this.props.visible ? "rightArrow cursorPointer" : "rightArrow"} onClick={this.props.onRightClick}></div>
                </div>
            </div>
        );
    }
}