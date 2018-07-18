import React from 'react';
import ReactDOM from 'react-dom';
import "./openCard.css";
import Logic from '../../logic.js';
import Card from '../Card/card';



export default class OpenCard extends React.Component {


    render(){

        return(
            <div className="openCards">
                {this.renderCard()}
            </div>
        );
    }

    renderCard() {
        const openCardSrc = this.props.card.getSrc();
        return (
            <Card src={openCardSrc} onCardClickFunc={()=>{}}/>
        )
    }
}