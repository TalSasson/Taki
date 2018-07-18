import React from 'react';
import ReactDOM from 'react-dom';
import "./changeColor.css";
import Logic from '../../logic.js';

export default class ChangeColor extends React.Component {


    render(){

        return(
            <div className={this.props.visible ? "changeColor visibleChangeColor" : "changeColor"}>            
                <div className="line">
                    <div className="colorChoice yellow" onClick={this.props.visible ? this.onColorChoiceClick.bind(this) : ()=>{}}>
                    </div>
                    <div className="colorChoice blue" onClick={this.props.visible ? this.onColorChoiceClick.bind(this) : ()=>{}}>
                    </div>
                </div>
                <div className="line">
                    <div className="colorChoice red" onClick={this.props.visible ? this.onColorChoiceClick.bind(this) : ()=>{}}>
                    </div>
                    <div className="colorChoice green" onClick={this.props.visible ? this.onColorChoiceClick.bind(this) : ()=>{}}>
                    </div>
                </div>
            </div>
        )
    }

    onColorChoiceClick(event){
        let color = event.target.classList[1];
        this.props.onColorChoiceClickFunc(color);
    }

}