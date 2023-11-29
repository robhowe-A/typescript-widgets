//--Copyright (c) 2023 Robert A. Howell
import SlideShow from "./CardSlideShow";

const CardsSlideShow = {
  init: () => {
    let aacards = document.querySelectorAll(".slideshow .slide") as NodeListOf<HTMLDivElement>;

    //Implement slideshow
    let slideshow: SlideShow;
    slideshow = new SlideShow(aacards, 2);

    //Build the markup needed for the slideshow
    CardsSlideShow.addSlideShowMarkup(slideshow);

    //Hide overflow elements
    CardsSlideShow.hideOverflowElements(slideshow);

    //Next+previous button event listeners
    slideshow.nextbtn.addEventListener("click", e => {
      e.preventDefault();
      slideshow.next();
    });
    slideshow.prevbtn.addEventListener("click", e => {
      e.preventDefault();
      slideshow.previous();
    });
  },
  addSlideShowMarkup: slideshow => {
    //Add the cards to a new container
    let slideshowslides = slideshow.slideshowcontainer.appendChild(document.createElement("div"));
    for (let card of slideshow.cards) {
      let temp = card;
      slideshowslides.insertAdjacentElement("beforeend", temp);
    }
    //Style the container with flexbox
    slideshowslides.classList.add("slidescontainer");
    slideshowslides.style.width = "100%";
    slideshowslides.style.height = "10em";
    slideshowslides.style.display = "flex";
    slideshowslides.style.position = "relative";
    slideshow.slideshowcontainer.style.justifyContent = "center";

    //Add left and right buttons
    let slideshowbtns = slideshow.slideshowcontainer.appendChild(document.createElement("div"));

    //Left slideshow btn
    let previousslideshowbtn = document.createElement("button");
    previousslideshowbtn.classList.add("slideshowPrev");
    previousslideshowbtn.innerText = "❮";
    slideshowbtns.insertAdjacentElement("beforeend", previousslideshowbtn);

    //Update slideshow object
    slideshow.prevbtn = previousslideshowbtn;

    //Number element: used to show what slides are revealed
    slideshow.numberElement = document.createElement("div");

    slideshow.numberElementText(slideshow);
    previousslideshowbtn.insertAdjacentElement("afterend", slideshow.numberElement);
    //Number element styles
    slideshow.numberElement.style.whiteSpace = "nowrap";
    slideshow.numberElement.style.display = "grid";
    slideshow.numberElement.style.alignContent = "center";
    slideshow.numberElement.style.marginInline = "1.5rem";

    //Right slideshow btn
    let nextslideshowbtn = document.createElement("button");
    nextslideshowbtn.classList.add("slideshowNext");
    nextslideshowbtn.innerText = "❯";
    slideshowbtns.insertAdjacentElement("beforeend", nextslideshowbtn);
    slideshowbtns.style.display = "flex";
    slideshowbtns.style.justifyContent = "center";
    //Update slideshow object
    slideshow.nextbtn = nextslideshowbtn;
  },

  hideOverflowElements: slideshowwidget => {
    if (slideshowwidget.cardindxstart < slideshowwidget.cardquantshow) {
      for (let i = slideshowwidget.cards.length - 1; i > slideshowwidget.cardsindxend; i--) {
        slideshowwidget.cards[i].style.position = "absolute";
        slideshowwidget.cards[i].style.opacity = "0%";
        slideshowwidget.cards[i].style.display = "none";
        slideshowwidget.cards[i].style.transform = "translateX(182.5px)";
        continue;
      }
    }
  },
};

CardsSlideShow.init();
