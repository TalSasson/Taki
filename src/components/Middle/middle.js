import React from 'react';
import ReactDOM from 'react-dom';
import "./middle.css";
import Logic from '../../logic.js';
import Card from '../Card/card';
import OpenCard from '../OpenCard/openCard';
import Statistics from '../Statistics/statistics';
import Deck from '../Deck/deck';


export default class Middle extends React.Component {

    render(){

        return(
            <div className="middleWrapper wrapper">
                <div className="statisticsWrapper">
                    <div className={this.props.enableEndGameBtn ? "endGameBtnUser" : "endGameBtnUser disabled"} onClick={this.onEndGameClick.bind(this)}>
                        <span>End Game</span>
                    </div>
                    <Statistics info={this.props.statistics}/>
                </div>

                <OpenCard card={this.props.openCard}/>

                <Deck onDeckClickFunc={this.props.onDeckClickFunc} deckCardsCount={this.props.deckCardsCount}/>
                

            </div>
        );

    }

    onEndGameClick(event){
        this.props.showEndGameScreen("computer");
    }
}