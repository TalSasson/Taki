import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";
import Logic from '../../logic.js';
import PlayerStack from '../PlayerStack/playerStack';
import Middle from '../Middle/middle';
import ChangeColor from '../ChangeColor/changeColor';
import EndGame from '../EndGame/endGame';
import Warning from '../Warning/warning';
import ReplayArrows from '../ReplayArrows/replayArrows';


export default class App extends React.Component {

    constructor(args){
        super(...args);
        this.computerTurnTimeout = null;
        this.sleepTurnTime = 1500;
        this.recCount = 0;

        this.state = {
            
            userCards:[],
            computerCards:[],
            openCard:{},
            deckCardsCount:0,
            statistics:{},            

            onCardClickFunc: this.onUserCardClick,
            onDeckClickFunc: this.onUserDeckClick,
            isChangeColorVisible: false,
            isEndGameVisible: false,
            isUserStackEnable: true,
            isDeckEnable: true,
            isWarningVisible: false,
            warningMsg: "",
            winner: "",
            arrows: false
        };

    }

    render() {
        
        return (
            <div className="boardWrapper">
                <ReplayArrows visible={this.state.arrows} onRightClick={this.onRightClick.bind(this)} onLeftClick={this.onLeftClick.bind(this)} startGame={this.startGame.bind(this)} />
                <div className={this.state.isChangeColorVisible ? "blurScreen stackWrappers" : this.state.isEndGameVisible ? "opacityScreen stackWrappers" : "stackWrappers"} >
                    <PlayerStack id="computer" cards={this.state.computerCards} isEnable={true}/>
                    <Middle openCard={this.state.openCard} onDeckClickFunc={this.state.onDeckClickFunc.bind(this)} deckCardsCount={this.state.deckCardsCount} statistics={this.state.statistics} showEndGameScreen={this.endGame.bind(this)} enableEndGameBtn={!this.state.arrows}/>
                    <PlayerStack id="user" cards={this.state.userCards} onCardClickFunc={this.state.onCardClickFunc.bind(this)} isEnable={this.state.isUserStackEnable}/>                
                </div>
                <ChangeColor visible={this.state.isChangeColorVisible} onColorChoiceClickFunc={this.onColorChoiceClick.bind(this)}/>
                <EndGame visible={this.state.isEndGameVisible} winner={this.state.winner} statistics={this.state.statistics} startGame={this.startGame.bind(this)} onReplayClick={this.onReplayClick.bind(this)}/>
                <Warning isMsgVisible={this.state.isWarningVisible} msg={this.state.warningMsg}/>
            </div>
        );
    }

    componentWillMount(){
        this.startGame();
    }

    cbFunc(args){
        if (args.includes("user"))
            this.setState({userCards: Logic.getUserCards()});
        if (args.includes("enableUserStack")){
            this.setState({isUserStackEnable: true});
            if(this.state.onCardClickFunc === this.onUserCardClickPlus2Mode) // we are in plus2 mode
                this.setState({onDeckClickFunc: this.onUserDeckClickPlus2Mode});
            else
                this.setState({onDeckClickFunc: this.onUserDeckClick});
        }
        if (args.includes("disableUserStack")){
            this.setState({isUserStackEnable: false});
            this.setState({onDeckClickFunc: ()=>{} });
        }
        if (args.includes("computer"))
            this.setState({computerCards: Logic.getComputerCards()});
        if (args.includes("openCard"))
            this.setState({openCard: Logic.getOpenCard()});
        if (args.includes("deck"))
            this.setState({deckCardsCount: Logic.getDeckLength()});
        if (args.includes("statistics"))
            this.setState({statistics: Logic.getStatistics()});
    }

    startGame()
    {
        Logic.SetUICallback(this.cbFunc.bind(this));
        Logic.initializeBoard();
        this.setState({
            isEndGameVisible: false,
            arrows: false
        });
        this.cbFunc(["enableUserStack"])
    }

    onReplayClick()
    {
        this.setState({
            isEndGameVisible: false,
            arrows: true
        });
        Logic.activateReplayMode();

    }

    onRightClick(){
        Logic.replayForward();
    }

    onLeftClick(){
        Logic.replayBackward();
    }



    onUserCardClick(eventSrc){
        let i, src, toChange, card, chosenCard, winner, totalMoves;
        src = this.shortcutSrc(eventSrc);
        chosenCard = Logic.onUserCardClick(src);
        if (chosenCard){            
            if(chosenCard.getName().substring(0, 4) === "taki"){

                if(chosenCard.getName() === "taki_colorful")
                    Logic.setTakiColorfulColor();

                //change user click to taki mode
                Logic.setTakiModeCounter(); // count how many cards in the stack have the same color like the taki
                if(Logic.getTakiModeCounter() !== 0){
                    this.setState({onCardClickFunc : this.onUserCardClickTakiMode });
                }
                else{
                    Logic.turnDone("user", "disableUserStack");
                    this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
                }                         
            }

            if(chosenCard.getName() === "2plus"){
                Logic.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                this.setState({onCardClickFunc : this.onUserCardClickPlus2Mode }); 
                this.setState({onDeckClickFunc : this.onUserDeckClickPlus2Mode }); 
                Logic.turnDone("user", "disableUserStack");
                this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
            }

            if(chosenCard.getName() === "stop"){
                Logic.turnDone("user");
            }
            if(chosenCard.getName() === "plus"){
                //do not need to do anything
            }
            if(chosenCard.getName() === "change_colorful"){
                if (Logic.getStackLength("user") > 0){
                    this.setState({isChangeColorVisible : true });
                }
                Logic.turnDone("user", "disableUserStack");
            }
            if(chosenCard.getType() === "number"){
                Logic.turnDone("user", "disableUserStack");
                this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
            } 
        }
        else{
            this.setState({isWarningVisible: true, warningMsg: "Illegal card"});
            setTimeout(()=>{
                this.setState({isWarningVisible: false});
            },1000);
        }

        if(Logic.getLastCard().getName() !== "plus"){
            winner = Logic.checkEndGame();
            if (winner) this.endGame(winner);

        }
        
    }

    onUserCardClickTakiMode(eventSrc){
        let i, src, toChange, card, chosenCard, winner, totalMoves;
        src = this.shortcutSrc(eventSrc);    
        chosenCard = Logic.onUserCardClickTakiMode(src);
        if(chosenCard){
            if (Logic.getTakiModeCounter() === 0){
                //exit from taki mode
                //change User Event Listener To Regular Mode
                this.setState({onCardClickFunc : this.onUserCardClick });

                //check if the last card in the taki is 2plus.
                if(Logic.getLastCard().getName() === "2plus"){
                    Logic.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                    this.setState({onCardClickFunc : this.onUserCardClickPlus2Mode }); 
                    this.setState({onDeckClickFunc : this.onUserDeckClickPlus2Mode });                     
                }
                //check if the last card in the taki is stop or plus, if so, the user has one more turn.
                if(Logic.getLastCard().getName() !== "stop" && Logic.getLastCard().getName() !== "plus"){                
                    Logic.turnDone("user", "disableUserStack");
                    this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
                }
                if(Logic.getLastCard().getName() === "stop"){
                    Logic.turnDone("user");
                }                
            }
        }
        else{
            this.setState({isWarningVisible: true, warningMsg: "Illegal card"});
            setTimeout(()=>{
                this.setState({isWarningVisible: false});
            },1000);
        }
    
        winner = Logic.checkEndGame();
        if (winner) this.endGame(winner);
    }

    onUserCardClickPlus2Mode(eventSrc){
        let i, src, toChange, card, chosenCard, winner, totalMoves;
        src = this.shortcutSrc(eventSrc);
        chosenCard = Logic.onUserCardClickPlus2Mode(src);
        if (chosenCard){
            Logic.turnDone("user", "disableUserStack");
            this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
        }
        else{ // the card is not 2plus
            this.setState({isWarningVisible: true, warningMsg: "Illegal card"});
            setTimeout(()=>{
                this.setState({isWarningVisible: false});
            },1000);
        }
    }
    
    onColorChoiceClick(color){
        let cardSrc, boardWrapper, changeColor;
        cardSrc = Logic.chooseColor(color);
        this.setState({isChangeColorVisible : false });
        this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
    }

    setUserTakiColorful(){
        let card;
        card = Logic.setTakiColorfulColor();
        setTimeout(this.computerTakiMode.bind(this), this.sleepTurnTime, card.getColor());
    }

    onUserDeckClick(){
        let card, cardsStack, cardContainerNode, stack, totalMoves;
        card = Logic.onUserDeckClick();
        if(card){
            Logic.turnDone("user", "disableUserStack");
            this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
        }
        else{
            this.setState({isWarningVisible: true, warningMsg: "You have a suitable card"});
                setTimeout(()=>{
                this.setState({isWarningVisible: false});
            },1000);
        }
    }

    onUserDeckClickPlus2Mode(){
        let card, cardsStack, cardContainerNode, stack, totalMoves;
        card = Logic.onUserDeckClickPlus2Mode();
        if(card){
            this.setState({onCardClickFunc : this.onUserCardClick });
            this.setState({onDeckClickFunc : this.onUserDeckClick }); 

            Logic.turnDone("user", "disableUserStack");
            this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
        }
        else{  // if card === null the user have a suitable card
            this.setState({isWarningVisible: true, warningMsg: "You have a suitable card"});
            setTimeout(()=>{
                this.setState({isWarningVisible: false});
            },1000);
        }
    }

    computerTurn(){
        let winner, card, totalMoves, i, counter;
        if(this.state.onCardClickFunc === this.onUserCardClickPlus2Mode){ // we are in plus2 mode
            card = Logic.computerPlus2ModeTurn();
            if (card == null){
                counter = Logic.getPlus2ModeCounter() * 2;
                for(i=0;i<counter;i++)
                    Logic.cardFromDeckToComputer();
                Logic.initializePlus2Counter();
                this.setState({onCardClickFunc : this.onUserCardClick });
                this.setState({onDeckClickFunc : this.onUserDeckClick });
            }
        }
        else{
            card = Logic.computerTurn();
            if (card){
                if (card.getName() === "stop"){
                    if (Logic.getStackLength("computer") > 0){
                        this.recCount++;
                        this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime); 
                    }
                    Logic.turnDone("computer");
                }
                else if (card.getName() === "plus"){
                    this.recCount++;
                    this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime); 
                }
                else if (card.getName() === "taki"){
                    this.recCount++;
                    setTimeout(this.computerTakiMode.bind(this), this.sleepTurnTime, card.getColor());
                }
                else if (card.getName() === "2plus"){
                    this.setState({onCardClickFunc : this.onUserCardClickPlus2Mode });
                    this.setState({onDeckClickFunc : this.onUserDeckClickPlus2Mode });
                    Logic.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                }
                else if(card.getName() === "change_colorful"){
                    this.recCount++;
                    setTimeout(this.computerChooseColor.bind(this), this.sleepTurnTime);
                }
                else if(card.getName() === "taki_colorful"){
                    this.recCount++;
                    setTimeout(this.setComputerTakiColorful.bind(this), this.sleepTurnTime/2, "computer");
                }
            }
            else{
                Logic.cardFromDeckToComputer();
            }
        }
    
        //enable the user cards only at the end of the recursions.        
        if (this.recCount === 0){            
            Logic.turnDone("computer", "enableUserStack");
        }
        else    
            this.recCount--;
        
        if(Logic.getLastCard().getName() !== "plus"){
            winner = Logic.checkEndGame();
            if (winner) this.endGame(winner);
        }
    }

    computerTakiMode(color){
        let card, totalMoves;
        card = Logic.computerTakiMode(color);
        if (card){       
            setTimeout(this.computerTakiMode.bind(this), this.sleepTurnTime, color);
        }
        else{
            if (Logic.getLastCard().getName() === "stop"){
                if (Logic.getStackLength("computer") > 0){
                    this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
                }
            }
            else if (Logic.getLastCard().getName() === "plus"){
                this.computerTurnTimeout = setTimeout(this.computerTurn.bind(this), this.sleepTurnTime);
            } 
            else if (Logic.getLastCard().getName() === "2plus"){
                this.setState({onCardClickFunc : this.onUserCardClickPlus2Mode });
                this.setState({onDeckClickFunc : this.onUserDeckClickPlus2Mode });
                Logic.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                Logic.turnDone("computer", "enableUserStack");
            } 
            else{
                Logic.turnDone("computer", "enableUserStack");
            }
        }
    }

    computerChooseColor(){
        let cardSrc, totalMoves;
        cardSrc = Logic.chooseColor();
        Logic.turnDone("computer", "enableUserStack");

    }

    setComputerTakiColorful(){
        let card;
        card = Logic.setTakiColorfulColor();
        setTimeout(this.computerTakiMode.bind(this), this.sleepTurnTime, card.getColor());
    }

    shortcutSrc(src){
        let i, res;
        i = src.indexOf("cards");
        res = src.substring(i, src.length);
        return res;
    }

    endGame(theWinner){
        var boardWrapper, winnerDiv, timerDisplay, turnsCount, avgTurnTime, countLastCard;
        let endGame, endGameAvgTurnTime, endGameTimerDisplay;
        clearTimeout(this.computerTurnTimeout);    
        this.cbFunc(["disableUserStack"])
    
        this.setState({
            winner: theWinner,
            isEndGameVisible: true
        });
        Logic.clearTimerInterval();
        
    }
}