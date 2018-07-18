
class LogicStatistics{

    constructor(){
        this.turnCount=0;        
        this.lastCardCount=0;
        this.timeElapsedInSec=0;
    }

    deepClone(statistics){
        this.turnCount= statistics.getTotalMoves();
        this.lastCardCount= statistics.getLastCardCount();
        this.timeElapsedInSec= statistics.getTimeElapsedInSec();

    }

    increaceTurnCount(){
        this.turnCount++;
    }
    increaceLastCardCount(num){
        this.lastCardCount++;
    }
    getLastCardCount(){
        return this.lastCardCount;
    }
    getTotalMoves(){
        return this.turnCount;
    }
    increaseTimeElapsedInSec(){
        this.timeElapsedInSec++;
    }
    getTimeElapsedInSec(){
        return this.timeElapsedInSec;
    }
    getAvg(){
        if (this.turnCount === 0) return 0;
            return this.timeElapsedInSec/this.turnCount;
    }
}

class LogicCard{

    constructor(i_name, i_color, i_type){
        this.name= i_name;
        this.color= i_color;
        this.type= i_type;
    }


    getType() { return this.type;}
    getName() { return this.name;}
    getColor() { return this.color;}
    setColor(newColor) {
        this.color = newColor;
    }

    getSrc(){

        let res;

        if(this.name === "taki_colorful" && this.color)
            res = "../src/cards/taki";
        else
            res = "../src/cards/" + this.name;

        if(this.color)
            res += "_" + this.color;
        res += ".png";
        
        return res;
    }
    
    isPowerCard(){
        return (this.name === "change_colorful" || this.name === "taki_colorful");
    }
}

class LogicDeck{

    constructor(){
        this.cardsArr = [];
    }

    getLength(){return this.cardsArr.length;}

    initializeDeck(){
        let i, j, k;
        const colorsArr = ["blue", "green", "yellow", "red"];
        const namesArr = ["1","3","4","5","6","7","8","9","2plus","plus","stop","taki","change_colorful"];
        
        for(i = 0; i < 4; i++)
        {
            for(j = 0; j < namesArr.length; j++)
            {        
                for(k = 0; k < (j <= 11 ? 2 : 1 ); k++)//change color - only 4 cards, 1 each iteration.
                {
                    this.cardsArr.push(new LogicCard(
                        /*name=*/ namesArr[j],
                        /*color=*/ j <= 11 ? colorsArr[i] : 0 ,
                        /*type=*/ j <= 7 ? "number" : "action"
                    ));
                }
            }
        }

        // add two taki_colorful cards:
        for(i = 0; i < 2; i++)
        {
            this.cardsArr.push(new LogicCard(
                /*name=*/ "taki_colorful",
                /*color=*/ 0 ,
                /*type=*/ "action"
            ));
        }

    }

    removeRandomCard(){
        let randNum, tempCard, res;

        if (this.cardsArr.length === 0){
            return null;
        }

        randNum = getRandomNum(0, this.cardsArr.length);
        tempCard = this.cardsArr[randNum];
        this.cardsArr[randNum] = this.cardsArr[this.cardsArr.length-1];
        this.cardsArr[this.cardsArr.length-1] = tempCard;
        res = tempCard;
        this.cardsArr.pop();
        return res;
    }

    addCard(card){            
        this.cardsArr.push(card);            
    }

}

class LogicStack{
    
    constructor(){
        this.cardsArr = [];
    }

    deepClone(stack){
        this.cardsArr = stack.cardsArr.slice();
    }

    getCardsArr(){
        return this.cardsArr;
    }

    getLength(){return this.cardsArr.length;}

    addCard(card){
        this.cardsArr.push(card);            
    }

    removeCard(card){
        let tempCard, i, res;
        if(!card){ // if we don't send a argument, we will remove the first card.
            res = this.cardsArr.shift();               
        }
        else{ // else, we will find the card and remove it.
            for(i=0;i<this.cardsArr.length;i++){
                if (card === this.cardsArr[i])
                    break;
            }
            tempCard = this.cardsArr[i];
            this.cardsArr[i] = this.cardsArr[this.cardsArr.length-1];
            this.cardsArr[this.cardsArr.length-1] = tempCard;
            res = tempCard;
            this.cardsArr.pop();                
        }

        return res;
    }

    getCardBySrc(src){
        let i;
        src= "../src/" + src;
        for(i=0;i<this.cardsArr.length;i++){            
            if (src === this.cardsArr[i].getSrc())
                return this.cardsArr[i];
        }
        return null;
    }

    getLastCard(){
        return this.cardsArr[this.cardsArr.length-1];
    }

    getPrevLastCard(){
        return this.cardsArr[this.cardsArr.length-2];
    }

    isExist(name, color){
        let i;
        for(i=0;i<this.cardsArr.length;i++){
            if ((name === "" && this.cardsArr[i].getColor() === color)                         ||
                (name === this.cardsArr[i].getName() && color === "")                          ||
                (this.cardsArr[i].getName() === name && this.cardsArr[i].getColor() === color) ||
                (name === this.cardsArr[i].getName().substring(0,4) && color === "")){
                    return this.cardsArr[i];
                }                    
        }
        return null;
    }

    countCardsInColor(color){
        let i, count = 0;
        for(i=0;i<this.cardsArr.length;i++){            
            if (this.cardsArr[i].getColor() === color)
                count++;
        }
        return count;        
    }

    isPossibleMove(openCard){
        let returnCard;

        if ((returnCard = this.isExist("2plus", openCard.getColor()))||
            (returnCard = this.isExist("change_colorful", 0))        ||
            (returnCard = this.isExist("stop", openCard.getColor())) ||
            (returnCard = this.isExist("plus", openCard.getColor())) ||
            (returnCard = this.isExist("taki_colorful", 0))          ||
            (returnCard = this.isExist("taki", openCard.getColor())) ||               
            (returnCard = this.isExist("", openCard.getColor()))     ||           
            (returnCard = this.isExist(openCard.getName(), ""))      ||
            (returnCard = this.isExist(openCard.getName().substring(0,4), "")))            
            {
                return returnCard;
            }
        return null;
    }

    
}

class LogicHistory{

    constructor(deckCardsCount, userCards, computerCards, openCard, statistics){
        this.deckCardsCount = deckCardsCount;
        this.userCards = userCards;
        this.computerCards = computerCards;
        this.openCard = openCard;
        this.statistics = statistics; 
    }

    getDeckCardsCount(){
        return this.deckCardsCount;
    }

    getUserCardsArr(){
        return this.userCards.getCardsArr();
    }

    getComputerCardsArr(){
        return this.computerCards.getCardsArr();
    }

    getOpenCard(){
        return this.openCard;
    }

    getStatistics(){
        return this.statistics;
    }

}

class LogicBoard{

    constructor(){
        this.deck;
        this.userCards;
        this.computerCards;
        this.openCards;
        this.statistics;        
        this.takiModeCounter;
        this.plus2ModeCounter;
        this.cbFunction;
        this.timerInterval;
        this.historyArray;
        this.isReplayMode;
        this.replayPosition;
    }

    initializeBoard(){
        let i;

        this.deck = new LogicDeck();
        this.userCards = new LogicStack()
        this.computerCards = new LogicStack();
        this.openCards = new LogicStack();
        this.statistics = new LogicStatistics();        
        this.takiModeCounter = 0;
        this.plus2ModeCounter = 0;        
        this.timerInterval = null;
        this.historyArray = [];
        this.isReplayMode = false;
        this.replayPosition = 0;

        this.deck.initializeDeck();
        for(i=0;i<8;i++)
        {
            this.cardFromDeckToUser();
            this.cardFromDeckToComputer();
        }
        this.cardFromDeckToOpenCards();        
        this.cbFunction(["user", "computer", "openCard", "deck", "statistics"]);
        this.timer();
        this.addHistoryItem();
    }

    addHistoryItem(){
        let history;

        let deckCardsCountCopy =  this.getDeckLength();
        let userCardsCopy = new LogicStack();
        userCardsCopy.deepClone(this.userCards);
        let computerCardsCopy = new LogicStack();
        computerCardsCopy.deepClone(this.computerCards);
        let openCard = this.getOpenCard();
        let statisticsCopy = new LogicStatistics();
        statisticsCopy.deepClone(this.statistics);

        history = new LogicHistory(deckCardsCountCopy, userCardsCopy, computerCardsCopy, openCard, statisticsCopy);
        this.historyArray.push(history);        

    }

    activateReplayMode(){
        this.isReplayMode = true;
        this.replayPosition = 0;
        this.cbFunction(["user", "computer", "openCard", "deck", "statistics"]);
    }

    replayForward(){
        if(this.replayPosition < this.historyArray.length-1){
            this.replayPosition++;
            this.cbFunction(["user", "computer", "openCard", "deck", "statistics"]);
        }            
    }

    replayBackward(){
        if(this.replayPosition > 0){
            this.replayPosition--;
            this.cbFunction(["user", "computer", "openCard", "deck", "statistics"]);
        }            
    }

    SetUICallback(func){
        this.cbFunction = func;
    } 
    getUserCards(){
        if (this.isReplayMode)
            return this.historyArray[this.replayPosition].getUserCardsArr();
        else
            return this.userCards.getCardsArr();
    }
    getComputerCards(){
        if (this.isReplayMode)
            return this.historyArray[this.replayPosition].getComputerCardsArr();
        else
            return this.computerCards.getCardsArr();
    }
    getStatistics(){
        if (this.isReplayMode)
            return this.historyArray[this.replayPosition].getStatistics();
        else
            return this.statistics;
    }
    getDeckLength(){
        if (this.isReplayMode)
            return this.historyArray[this.replayPosition].getDeckCardsCount();
        else
            return this.deck.getLength();
    }    
    getOpenCard(){
        if (this.isReplayMode)
            return this.historyArray[this.replayPosition].getOpenCard();
        else
            return this.openCards.getLastCard();
    }
    getTakiModeCounter(){
        return this.takiModeCounter;
    }
    getPlus2ModeCounter(){
        return this.plus2ModeCounter;
    }
    increasePlus2ModeCounter(){
        this.plus2ModeCounter++;
    }
    initializePlus2Counter(){
        this.plus2ModeCounter=0;
    }
    increaseTimeElapsedInSec(){
        this.statistics.increaseTimeElapsedInSec();
    }
    getTimeElapsedInSec(){
        return this.statistics.getTimeElapsedInSec();
    }
    getAvg(){
        return this.statistics.getAvg();
    }
    increaceLastCardCount(){
        this.statistics.increaceLastCardCount();
    }
    getLastCardCount(){
        return this.statistics.getLastCardCount();
    }
    getStackLength(player){
        if (player === "user")
            return this.userCards.getLength();
        if (player === "computer")
            return this.computerCards.getLength();
    }
    turnDone(player, disableEnable){
        this.statistics.increaceTurnCount();
        this.reachedLastCard(player);
        
        if(disableEnable){
            this.cbFunction([disableEnable])
        }

        this.cbFunction(["statistics"]);

        this.addHistoryItem();

    }
    getTotalMoves(){
        return this.statistics.getTotalMoves();
    }
    cardFromDeckToUser(){
        let card = this.deck.removeRandomCard();            
        this.userCards.addCard(card);
        if (this.deck.getLength() === 0) 
            this.moveAllOpenCardsToDeck();        
        return card;
    }
    cardFromDeckToComputer(){
        let card = this.deck.removeRandomCard();
        this.computerCards.addCard(card);
        if (this.deck.getLength() === 0) 
            this.moveAllOpenCardsToDeck();          
        this.cbFunction(["computer", "deck"]);        
        return card;
    }
    reachedLastCard(player){
        if(player === "user" && this.userCards.getLength() === 1)
            this.statistics.increaceLastCardCount();
        if(player === "computer" && this.computerCards.getLength() === 1)
            this.statistics.increaceLastCardCount();        
    }
    cardFromDeckToOpenCards(){
        let card;
        let found = false;
        while (!found){
            card = this.deck.removeRandomCard();
            if (card.getType() === "number"){
                found = true;
                this.openCards.addCard(card);
            }
            else{
                this.deck.addCard(card);
            }
        }

        return card;
    }
    cardFromUserToOpenCards(userCard){
        let card = this.userCards.removeCard(userCard);
        this.openCards.addCard(card);
    }
    cardFromCompToOpenCards(userCard){
        let card = this.computerCards.removeCard(userCard);
        this.openCards.addCard(card);
    }
    cardFromOpenCardsToDeck(){
        let card = openCards.removeCard();
        if(card.getName() === "change_colorful" || card.getName() === "taki_colorful")
            card.setColor(0);
        this.deck.addCard(card);
        this.cbFunction(["deck", "openCard"]);
    }
    moveAllOpenCardsToDeck(){
        while(this.openCards.getLength() > 1){
            this.cardFromOpenCardsToDeck();
        }
    }
    getLastCard(){
        return this.openCards.getLastCard();
    }   

    onUserCardClick(src){ //checks if the card is suitable to the open card.
        let userCard, openCard;
        userCard = this.userCards.getCardBySrc(src);
        openCard = this.openCards.getLastCard();         
        if( userCard.getName() === openCard.getName()   ||
            userCard.getColor() === openCard.getColor() || 
            userCard.isPowerCard()                      || 
            userCard.getName().substring(0,4) === openCard.getName().substring(0,4) )
            {
                this.cardFromUserToOpenCards(userCard);
                this.cbFunction(["user", "openCard"]);
                return userCard;                   
            }
        return null;                        
    }

    onUserCardClickTakiMode(src){
        let userCard, openCard;
        
        userCard = this.userCards.getCardBySrc(src);
        openCard = this.openCards.getLastCard();         
        if(userCard.getColor() === openCard.getColor())
        {
            this.cardFromUserToOpenCards(userCard);
            this.takiModeCounter--;      
            this.cbFunction(["user", "openCard"]);          
            return userCard;                   
        }
        return null;                        
    }

    onUserCardClickPlus2Mode(src){
        let userCard, openCard;
        
        userCard = this.userCards.getCardBySrc(src);
        openCard = this.openCards.getLastCard();

        if(userCard.getName() === openCard.getName()) // === "2plus"
        {
            this.cardFromUserToOpenCards(userCard);
            this.increasePlus2ModeCounter();      
            this.cbFunction(["user", "openCard"]);          
            return userCard;                   
        }
        return null;  
    }

    setTakiModeCounter(){
        let color = this.openCards.getLastCard().getColor();
        this.takiModeCounter = this.userCards.countCardsInColor(color);

    }

    computerTurn(){
        let openCard = this.openCards.getLastCard();
        let card;            
        if (card = this.computerCards.isPossibleMove(openCard))
        {
            this.cardFromCompToOpenCards(card);
            this.cbFunction(["computer", "openCard"]);
        }
            
        return card;
    }

    computerTakiMode(color){
        let card = this.computerCards.isExist("", color);
        if (card){
            this.cardFromCompToOpenCards(card);
            this.cbFunction(["computer","openCard"]);
        }
        return card;
    }

    computerPlus2ModeTurn(){
        let card = this.computerCards.isExist("2plus", "");
        if (card){
            this.cardFromCompToOpenCards(card);
            this.increasePlus2ModeCounter();
            this.cbFunction(["computer","openCard"]);
        }
        return card;
    }

    onUserDeckClick(){
        let possibleCard, returnCard, openCard;
        openCard = this.openCards.getLastCard();
        possibleCard = this.userCards.isPossibleMove(openCard);
        if(possibleCard){
            returnCard =  null;
        }
        else{ //possibleCard === null
            returnCard = this.cardFromDeckToUser();
            this.cbFunction(["user","deck"]);
        }
        return returnCard;
    }

    onUserDeckClickPlus2Mode(){
        let possibleCard, returnCard, openCard, i, counter;
        openCard = this.openCards.getLastCard();
        possibleCard = this.userCards.isExist("2plus", "");
        if(possibleCard){
            returnCard =  null;
        }
        else{ //possibleCard === null
            counter = this.getPlus2ModeCounter() * 2;
            for (i=0;i<counter;i++)
                returnCard = this.cardFromDeckToUser();
            this.initializePlus2Counter();
            this.cbFunction(["user","deck"]);
        }
        return returnCard;
    }

    chooseColor(color){
        let colorsArr, randomColor, card;

        if (!color){// only for computer
            colorsArr = ["yellow", "red", "green", "blue"];
            color = colorsArr[getRandomNum(0,4)];
        }
        card = this.openCards.getLastCard();
        card.setColor(color);
        this.cbFunction(["openCard"]);
        return card.getSrc();            
    }

    setTakiColorfulColor(){
        let color, card;

        color = this.openCards.getPrevLastCard().getColor();
        card = this.openCards.getLastCard();
        card.setColor(color);
        this.cbFunction(["openCard"]);
        return card; 
    }

    checkEndGame(){
        if(this.computerCards.getLength() === 0){
            return "computer";
        }
        if(this.userCards.getLength() === 0){
            return "user";
        }
        return null;
    }

    timer(){
        this.timerInterval = setInterval(()=>{
            this.statistics.increaseTimeElapsedInSec();
            this.cbFunction(["statistics"]);            
        }, 1000);
    }

    clearTimerInterval(){
        clearInterval(this.timerInterval);
    }


}


function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}



const board =  new LogicBoard();
export default board;
