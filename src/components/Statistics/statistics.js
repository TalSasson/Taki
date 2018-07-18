import React from 'react';
import ReactDOM from 'react-dom';
import "./statistics.css";
import Logic from '../../logic.js';



export default class Statistics extends React.Component {
    constructor(props){
        super(props);
        this.totalMoves = 0;
        this.timeElapsedInSec = 0;
        
    }


    render(){

        return(
            <div className="statistics">
                <div className="timerDisplay item">Time elapsed: {this.setTime()}</div>
                <div className="turnsCount item">Total moves: {this.props.info.getTotalMoves()}</div>
                <div className="avgTurnTime item">Avg turn time: {this.setAvg()} sec</div>
                <div className="countLastCard item">Reached last card: {this.props.info.getLastCardCount()}</div>
            </div>
        );
    }

    setTime(){
        let timeInSec = this.props.info.getTimeElapsedInSec();
        let sec, min, minString, secString;
        min =  Math.floor(timeInSec/60);
        sec = timeInSec - min*60;

        minString = min < 10 ? ("0" + min) : min;
        secString = sec < 10 ? ("0" + sec) : sec;
        return (minString + ':' + secString);
    }

    setAvg(){
        let avg;
        if(this.props.info.getTotalMoves() === 0)
            return "00.00"
        else{
            if(this.totalMoves !== this.props.info.getTotalMoves()){
                this.totalMoves = this.props.info.getTotalMoves();
                this.timeElapsedInSec = this.props.info.getTimeElapsedInSec();
            }
            avg = this.timeElapsedInSec / this.totalMoves;
            avg = avg.toFixed(2);
            return avg;
        }

    }

}