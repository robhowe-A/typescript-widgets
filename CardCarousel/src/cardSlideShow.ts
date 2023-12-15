//--Copyright (c) 2023 Robert A. Howell

export default class SlideShow {
  cards: NodeListOf<HTMLDivElement>;
  cardQuantShow: number;
  cardIndxStart: number = 0;
  cardCounter: number = 1;
  cardsIndxEnd: number;
  turn: number = 0;
  maxTurnCount: number;
  slideshowcontainer: HTMLElement = document.querySelector(".slideshow") as HTMLElement;
  prevBtn: HTMLElement;
  nextBtn: HTMLElement;
  numberElement: HTMLElement;

  constructor(cards: NodeListOf<HTMLDivElement>, quantityShow: number) {
    this.cards = cards;
    this.cardQuantShow = quantityShow;
    this.cardsIndxEnd = this.cardQuantShow - 1;
    this.maxTurnCount = this.cards.length - this.cardQuantShow;
  }
  /**Brings visible the next slide element */
  next() {
    if (this.turn == this.maxTurnCount) {
      return;
    }
    //Hide the first element in slideshow
    this.cards[this.cardIndxStart].style.opacity = "0%";
    this.cards[this.cardIndxStart].style.display = "none";
    //Move the right element to left
    this.cards[this.cardIndxStart + 1].style.transform = "translateX(100px)";
    //Move in new element
    this.cards[this.cardsIndxEnd + 1].style.transform = "translateX(300px)";
    this.cards[this.cardsIndxEnd + 1].style.display = "block";
    //Display the next element for slideshow
    this.cards[this.cardsIndxEnd + 1].style.opacity = "100%";

    //Increment index counter
    this.cardIndxStart++;
    this.cardsIndxEnd++;
    this.turn++;
    this.cardCounter++;

    this.numberElementText();
  }
  /**Hides previous slide element */
  previous() {
    if (this.turn == 0) {
      return;
    }
    //Hide the last element in slideshow
    this.cards[this.cardsIndxEnd].style.opacity = "0%";
    this.cards[this.cardsIndxEnd].style.display = "none";

    //Move left element to the right
    this.cards[this.cardIndxStart].style.transform = "translateX(300px)";

    //Display the next element for slideshow
    this.cards[this.cardIndxStart - 1].style.display = "block";
    this.cards[this.cardIndxStart - 1].style.opacity = "100%";

    //Move in new element
    this.cards[this.cardIndxStart - 1].style.transform = "translateX(100px)";

    //Increment index counter
    this.cardIndxStart--;
    this.cardsIndxEnd--;
    this.turn--;
    this.cardCounter--;

    this.numberElementText();
  }

  public numberElementText() {
    //Change the text visible when next or previous is clicked
    this.numberElement.innerText =
      "[" +
      this.cardCounter.toString() +
      ".." +
      (this.cardCounter + this.cardQuantShow - 1).toString() +
      "]" +
      " of " +
      this.cards.length.toString();
  }
}
