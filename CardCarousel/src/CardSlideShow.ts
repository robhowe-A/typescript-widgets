//--Copyright (c) 2023 Robert A. Howell

export default class SlideShow {
  cards: NodeListOf<HTMLDivElement>;
  cardquantshow: number;
  cardindxstart: number = 0;
  cardcounter: number = 1;
  cardsindxend: number;
  turn: number = 0;
  maxturncount: number;
  slideshowcontainer: HTMLElement = document.querySelector(".slideshow") as HTMLElement;
  prevbtn: HTMLElement;
  nextbtn: HTMLElement;
  numberElement: HTMLElement;

  constructor(cards: NodeListOf<HTMLDivElement>, quantityshow: number) {
    this.cards = cards;
    this.cardquantshow = quantityshow;
    this.cardsindxend = this.cardquantshow - 1;
    this.maxturncount = this.cards.length - this.cardquantshow;
  }
  /**Brings visible the next slide element */
  next() {
    if (this.turn == this.maxturncount) {
      return;
    }
    //Hide the first element in slideshow
    this.cards[this.cardindxstart].style.opacity = "0%";
    this.cards[this.cardindxstart].style.display = "none";
    //Move the right element to left
    this.cards[this.cardindxstart + 1].style.transform = "translateX(100px)";
    //Move in new element
    this.cards[this.cardsindxend + 1].style.transform = "translateX(300px)";
    this.cards[this.cardsindxend + 1].style.display = "block";
    //Display the next element for slideshow
    this.cards[this.cardsindxend + 1].style.opacity = "100%";

    //Increment index counter
    this.cardindxstart++;
    this.cardsindxend++;
    this.turn++;
    this.cardcounter++;
  }
  /**Hides previous slide element */
  previous() {
    if (this.turn == 0) {
      return;
    }
    //Hide the last element in slideshow
    this.cards[this.cardsindxend].style.opacity = "0%";
    this.cards[this.cardsindxend].style.display = "none";

    //Move left element to the right
    this.cards[this.cardindxstart].style.transform = "translateX(300px)";

    //Display the next element for slideshow
    this.cards[this.cardindxstart - 1].style.display = "block";
    this.cards[this.cardindxstart - 1].style.opacity = "100%";

    //Move in new element
    this.cards[this.cardindxstart - 1].style.transform = "translateX(100px)";

    //Increment index counter
    this.cardindxstart--;
    this.cardsindxend--;
    this.turn--;
    this.cardcounter--;
  }

  numberElementText() {
    //Change the text visible when next or previous is clicked
    this.numberElement.innerText =
      "[" +
      this.cardcounter.toString() +
      ".." +
      (this.cardcounter + this.cardquantshow - 1).toString() +
      "]" +
      " of " +
      this.cards.length.toString();
  }
}
