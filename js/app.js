/*
 * Create a list that holds all of your cards
 */
let faArray = ['fa-diamond',
'fa-paper-plane-o',
'fa-anchor',
'fa-bolt',
'fa-cube',
'fa-anchor',
'fa-leaf',
'fa-bicycle',
'fa-diamond',
'fa-bomb',
'fa-leaf',
'fa-bomb',
'fa-bolt',
'fa-bicycle',
'fa-paper-plane-o',
'fa-cube'
,]

let openCardsList =new Array(16);
openCardsList.fill('',0,openCardsList.lenght);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
faArray = shuffle(faArray);
deckElement = document.querySelector('.deck');
deckElement.innerHTML = '';
for (let i = 0; i < faArray.length; i++) {
  //create <li> tag
  const liElement = document.createElement('li');
  liElement.classList.add('card');
  //crete <i> tag
  const iElement = document.createElement('i');
  iElement.classList.add('fa',faArray[i]);
  //append <i> to <li>
  liElement.appendChild(iElement);
  //apend <li> to <ul>
  deckElement.appendChild(liElement);
}


setEventListenerOnCards();

//click callback
function cardClicked(event) {
  displayCardSymbol(event);
   if(secondCardClicked() ) {

       if(isThereAMatch()) {
           lockCardSymbol();
           removeCardsFromOpenedCardList();
           if(isGameFinished()) {
            // stopTimer();
            // showPopUp();
           }

       } else {
           setTimeout(hideCardSymbol,1000);
           setTimeout(removeCardsFromOpenedCardList,1300);
       }

  }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCardSymbol(event) {
  event.target.classList.add("open","show");
  //console.log(event.target.parentNode);
  addCardToOpenedCard(event.target);

}

function addCardToOpenedCard(card) {
  const children = Array.from(card.parentNode.children);
  //console.log(children);

  for (let i = 0; i < children.length; i++) {
    if(children[i].classList.value =='card open show') {
        openCardsList[i] = children[i].innerHTML;
    }
  }

}

function isThereAMatch() {

  const filtered = openCardsList.filter(item => item !='')
  if( filtered[0] == filtered[1] ) {
    return true;
  } else {
    return false;
  }
}

function hideCardSymbol(){
  for (let i = 0; i < openCardsList.length; i++) {
      if( openCardsList[i] !== '' ) {
        let elements= document.querySelectorAll('.card.open.show');
        elements.forEach(function(element) {
          element.classList.remove('open','show');
        });
      }
  }
}

function removeCardsFromOpenedCardList(){

  openCardsList.fill('',0,openCardsList.length);

}
function secondCardClicked() {
 return (openCardsList.filter(item => item != '')).length == 2 ? true: false;

}

function lockCardSymbol(){
  for (let i = 0; i < openCardsList.length; i++) {
      if( openCardsList[i] !== '' ) {
        let elements= document.querySelectorAll('.card.open.show');
        elements.forEach(function(element) {
          element.classList.remove('open','show');
          element.classList.add('match');
          element.onclick = null;
        });
      }
  }

}

function isGameFinished() {

 return document.querySelectorAll('.card.match').length === 16 ? true: false;

}




function setEventListenerOnCards() {
  //HTMLCollection to array
  const cards = Array.from(document.querySelector('.deck').children);
  for (let i = 0; i < cards.length; i++) {
    cards[i].onclick = cardClicked;
  }

}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
