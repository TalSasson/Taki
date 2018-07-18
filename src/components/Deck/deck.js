import React from 'react';
import ReactDOM from 'react-dom';
import "./deck.css";
import Logic from '../../logic.js';



export default class Deck extends React.Component {

    render(){

        return(
            <div className="deckWrapper">                
                <div className="deckPicture card" onClick={this.onDeckClick.bind(this)}>
                    <img src="../src/cards/card_back.png" alt="deck"/>
                </div>

                <div className="cardsRemain">
                    {this.props.deckCardsCount + " card remain"}
                </div>
            </div>
        );
    }

    onDeckClick(event){        
        this.props.onDeckClickFunc();
    }
}