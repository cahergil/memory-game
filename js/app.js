/*
 * Initialization of global variables
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
];

let openCardsList = new Array(16);

let moveCounter;
let seconds = 0,
  minutes = 0,
  intervalId = -1;
let minutesSpan, secondsSpan;


/*
 *
 *   Starts the game
 *
 *
 */


//Initialization of the move moveCounter
initilizeMoveCounter();
//Initialization of the main panel(deck container) and cards
createDeckCards();
//after creation of card, set an event listener for each card
setEventListenerOnCards();
//set event listener on start(or restart) button;
setEventListenerOnStartButton();

function initTimer() {
  minutesSpan = document.querySelector('.minutes');
  secondsSpan = document.querySelector('.seconds');
  if (intervalId !== -1) {
    clearInterval(intervalId);
    resetTimer();
  }
  timer();

}

function resetTimer() {
  minutesSpan.innerHTML = '00';
  secondsSpan.innerHTML = '00';
  minutes = 0;
  seconds = 0;

}

function timer() {
  //t used to cleartime out later
  intervalId = setInterval(add, 1000);
  //console.log(intervalId);

}

function add() {
  seconds++;

  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }

  secondsSpan.innerHTML = seconds > 9 ? seconds : "0" + seconds;
  minutesSpan.innerHTML = minutes > 9 ? minutes : "0" + minutes;

}

function createDeckCards() {
  //reset list of opened cards to empty
  openCardsList.fill('', 0, openCardsList.lenght);
  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */
  faArray = shuffle(faArray);
  const deckElement = document.querySelector('.deck');
  deckElement.innerHTML = '';
  for (let i = 0; i < faArray.length; i++) {
    //create <li> tag
    const liElement = document.createElement('li');
    liElement.classList.add('card');
    //crete <i> tag
    const iElement = document.createElement('i');
    iElement.classList.add('fa', faArray[i]);
    //append <i> to <li>
    liElement.appendChild(iElement);
    //apend <li> to <ul>
    deckElement.appendChild(liElement);
  }
}




function pressStartButton() {

  createDeckCards();
  setEventListenerOnCards();
  if (intervalId !== -1) {
    clearInterval(intervalId);
    resetTimer();
  }
  initilizeMoveCounter();

}

function showModalDialog() {

  const dialog = document.querySelector('#myDialog');
  const moves = document.querySelector('.modal-moves');
  const totalTime = document.querySelector('.modal-total-time');
  const minutes = document.querySelector('.minutes');
  const seconds = document.querySelector('.seconds');
  const modalRating = document.querySelector('.modal-rating');

  //copy the stars in score-panel
  const nodeList = document.querySelectorAll('.fa-star');
  nodeList.forEach(function(element) {
    modalRating.innerHTML += element.outerHTML;
  });

  //moves
  moves.innerHTML = moveCounter;
  //total time to finish the game
  totalTime.innerHTML = minutes.innerHTML + ':' + seconds.innerHTML;

  //buttons yes callbacks
  const btnYes = document.querySelector('.btn-yes');

  btnYes.onclick = function() {
    dialog.close();
    pressStartButton();
    modalRating.innerHTML = '';
  };
  btnYes.onkeydown = function(event) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      dialog.close();
      pressStartButton();
      modalRating.innerHTML = '';
    }

  };

  //buttons no callbacks
  const btnNo = document.querySelector('.btn-no');

  btnNo.onclick = function() {
    dialog.close();
    modalRating.innerHTML = "";

  };
  btnNo.onkeydown = function(event) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      dialog.close();
      modalRating.innerHTML = "";
    }
  };

  dialog.showModal();

}

function alreadyTwoCardsOpened() {
  return (document.querySelectorAll('.card.open.show')).length == 2;
}

//click callback
function cardClicked(event) {

  if (moveCounter == 0) {
    //init timer
    initTimer();
  }
  //prevent more than 2 cards opened at the same time
  if (alreadyTwoCardsOpened()) {
    return;
  }


  displayCardSymbol(event);
  if (secondCardClicked()) {

    if (isThereAMatch()) {
      lockCardSymbol();
      removeCardsFromOpenedCardList();
      if (isGameFinished()) {
        // stop timer, but don't reset it yet
        clearInterval(intervalId);
        // showPopUp();
        // give time the matching animation to occur
        setTimeout(showModalDialog, 1000);

      }

    } else {
      setTimeout(hideCardSymbol, 1000);
      setTimeout(removeCardsFromOpenedCardList, 1300);
    }

  }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

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
  //disable temporarily click event on this card
  event.target.onclick = null;
  event.target.classList.add("open", "show");
  moveCounter++;
  checkMoveCounterStatus();
  //console.log(event.target.parentNode);
  addCardToOpenedCard(event.target);

}

function addCardToOpenedCard(card) {
  const children = Array.from(card.parentNode.children);
  //console.log(children);

  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.value == 'card open show') {
      openCardsList[i] = children[i].innerHTML;
    }
  }

}

function isThereAMatch() {

  const filtered = openCardsList.filter(item => item != '');
  if (filtered[0] == filtered[1]) {
    return true;
  } else {
    return false;
  }
}

function hideCardSymbol(event) {
  for (let i = 0; i < openCardsList.length; i++) {
    if (openCardsList[i] !== '') {
      let elements = document.querySelectorAll('.card.open.show');
      elements.forEach(function(element) {
        element.classList.remove('open', 'show');
        element.onclick = cardClicked;
      });
    }
  }
}

function removeCardsFromOpenedCardList() {

  openCardsList.fill('', 0, openCardsList.length);

}

function secondCardClicked() {
  return (openCardsList.filter(item => item != '')).length == 2 ? true : false;

}

function lockCardSymbol() {
  for (let i = 0; i < openCardsList.length; i++) {
    if (openCardsList[i] !== '') {
      let elements = document.querySelectorAll('.card.open.show');
      elements.forEach(function(element) {
        element.classList.remove('open', 'show');
        element.classList.add('match');
        element.onclick = null;
      });
    }
  }

}

function isGameFinished() {

  return document.querySelectorAll('.card.match').length === 16 ? true : false;

}

function initilizeMoveCounter() {

  moveCounter = 0;
  document.querySelector('.moves').innerHTML = moveCounter;
  const nodeList = document.querySelectorAll('.fa-star');
  nodeList.forEach(function(element) {
    element.style.color = '#B71C1C';

  });


}


function checkMoveCounterStatus() {
  document.querySelector('.moves').innerHTML = moveCounter;
  if (moveCounter < 20) {

  } else if (moveCounter < 35) {

    document.querySelector('.fa-star:nth-child(3)').style.color = '#ccc';

  } else {
    //http://nthmaster.com/
    document.querySelector('.fa-star:nth-child(n+2)').style.color = '#ccc';
  }

}


function setEventListenerOnStartButton() {

  const btnStart = document.querySelector('.button-start');
  btnStart.onclick = pressStartButton;
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
