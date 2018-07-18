import React from 'react';
import ReactDOM from 'react-dom';
import "./playerStack.css";
import Logic from '../../logic.js';
import Card from '../Card/card';


export default class PlayerStack extends React.Component {

    constructor(props){
        super(props);
        

        this.state = {
            cardsArrLength: 0,
            onCardClickFunc: props.onCardClickFunc,

        };

    }

    componentWillMount(){
        this.setState(() => {cardsArrLength: Logic.getStackLength(this.props.id)});
    }

    componentWillReceiveProps(nextProps){
        if(this.props.onCardClickFunc !== nextProps.onCardClickFunc || (this.props.isEnable !== nextProps.isEnable)){
            this.setState({ onCardClickFunc: nextProps.onCardClickFunc, isEnable: nextProps.isEnable});
        }
    }

    render() {
        return (
            <div className={this.props.isEnable ? "player wrapper" : "player wrapper disabled"} id={this.props.id}>
                <div className="stackWrapper">                      
                        {this.renderCards()}                    
                </div>           
            </div>
        );
    }

    renderCards() {
        const srcCardBack = "../src/cards/card_back.png";
        let logicCard, i;

        return (                 
            this.props.cards.map((logicCard, i) => 
                <div key={i}>
                    <Card 
                        src={this.props.id === "user" ? logicCard.getSrc() : srcCardBack}
                        onCardClickFunc={this.props.id === "user" ? this.state.onCardClickFunc : ()=>{}}
                    />
                </div>
            )
        )
    }
}