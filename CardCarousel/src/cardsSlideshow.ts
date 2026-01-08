//--Copyright (c) 2023 Robert A. Howell
import SlideShow from "./cardSlideShow";

const cardsSlideShow = {
  init: () => {
    let aaCards = document.querySelectorAll(".slideshow .slide") as NodeListOf<HTMLDivElement>;

    //Implement slideshow
    let slideShow: SlideShow;
    slideShow = new SlideShow(aaCards, 2);

    //Build the markup needed for the slideshow
    cardsSlideShow.addSlideShowMarkup(slideShow);

    //Hide overflow elements
    cardsSlideShow.hideOverflowElements(slideShow);

    //Next+previous button event listeners
    slideShow.nextBtn.addEventListener("click", e => {
      e.preventDefault();
      slideShow.next();
    });
    slideShow.prevBtn.addEventListener("click", e => {
      e.preventDefault();
      slideShow.previous();
    });
  },
  addSlideShowMarkup: (slideShow: SlideShow) => {
    //Add the cards to a new container
    let slides = slideShow.slideshowcontainer.appendChild(document.createElement("div"));
    for (let card of slideShow.cards) {
      let temp = card;
      slides.insertAdjacentElement("beforeend", temp);
    }
    //Style the container with flexbox
    slides.classList.add("slidescontainer");
    slides.style.width = "100%";
    slides.style.height = "10em";
    slides.style.display = "flex";
    slides.style.position = "relative";
    slideShow.slideshowcontainer.style.justifyContent = "center";

    //Add left and right buttons
    let slideShowBtns = slideShow.slideshowcontainer.appendChild(document.createElement("div"));

    //Left slideshow btn
    let previousSlideShowBtn = document.createElement("button");
    previousSlideShowBtn.classList.add("slideshowPrev");
    previousSlideShowBtn.innerText = "❮";
    slideShowBtns.insertAdjacentElement("beforeend", previousSlideShowBtn);

    //Update slideshow object
    slideShow.prevBtn = previousSlideShowBtn;

    //Number element: used to show what slides are revealed
    slideShow.numberElement = document.createElement("div");

    slideShow.numberElementText();
    previousSlideShowBtn.insertAdjacentElement("afterend", slideShow.numberElement);
    //Number element styles
    slideShow.numberElement.style.whiteSpace = "nowrap";
    slideShow.numberElement.style.display = "grid";
    slideShow.numberElement.style.alignContent = "center";
    slideShow.numberElement.style.marginInline = "1.5rem";

    //Right slideshow btn
    let nextSlideShowBtn = document.createElement("button");
    nextSlideShowBtn.classList.add("slideshowNext");
    nextSlideShowBtn.innerText = "❯";
    slideShowBtns.insertAdjacentElement("beforeend", nextSlideShowBtn);
    slideShowBtns.style.display = "flex";
    slideShowBtns.style.justifyContent = "center";
    //Update slideshow object
    slideShow.nextBtn = nextSlideShowBtn;
  },

  hideOverflowElements: (slideShowWidget: SlideShow) => {
    if (slideShowWidget.cardIndxStart < slideShowWidget.cardQuantShow) {
      for (let i = slideShowWidget.cards.length - 1; i > slideShowWidget.cardsIndxEnd; i--) {
        slideShowWidget.cards[i].style.position = "absolute";
        slideShowWidget.cards[i].style.opacity = "0%";
        slideShowWidget.cards[i].style.display = "none";
        slideShowWidget.cards[i].style.transform = "translateX(182.5px)";
        continue;
      }
    }
  },
};

cardsSlideShow.init();
