//--Copyright (c) 2023 Robert A. Howell
import CardSlideShow from "./CardSlideShow";

const CardsSlideShow = {
    init: () => {
        let aacards = document.querySelectorAll(".cardslideshow .slide") as NodeListOf<HTMLDivElement>;

        //Implement slideshow for arbitrary articles
        let aaslideshow: CardSlideShow;
        aaslideshow = new CardSlideShow(aacards, 2);

        //Build the markup needed for the slideshow
        //Add cards to container
        let slideshowslides = aaslideshow.slideshowcontainer.appendChild(document.createElement("div"));
        for (let card of aaslideshow.cards){
            let temp = card;
            slideshowslides.insertAdjacentElement("beforeend", temp);
        }
        //Container styles
        slideshowslides.classList.add("slidescontainer");
        slideshowslides.style.width = "100%";
        slideshowslides.style.height = "32em";
        slideshowslides.style.display = "flex";
        slideshowslides.style.position = "relative";
        aaslideshow.slideshowcontainer.style.justifyContent = "center";
        //Add left and right buttons
        let slideshowbtns = aaslideshow.slideshowcontainer.appendChild(document.createElement("div"));

        //Left slideshow btn
        let previousslideshowbtn = document.createElement("button");
        previousslideshowbtn.classList.add('slideshowPrev');
        previousslideshowbtn.innerText = "❮";
        slideshowbtns.insertAdjacentElement('beforeend', previousslideshowbtn);
        //Update slideshow object
        aaslideshow.prevbtn = previousslideshowbtn;

        //Number element
        let numberelement = document.createElement("div");
        let numberelementtext = () => {
            numberelement.innerText = "[" + aaslideshow.cardcounter.toString() + ".." + 
            (aaslideshow.cardcounter + aaslideshow.cardquantshow - 1).toString() + "]" + " of " + aaslideshow.cards.length.toString();
        }
        numberelementtext();
        previousslideshowbtn.insertAdjacentElement('afterend', numberelement);
        numberelement.style.whiteSpace = "nowrap";
        numberelement.style.display = "grid";
        numberelement.style.alignContent = "center";
        numberelement.style.marginInline = "1.5rem";

        //Right slideshow btn
        let nextslideshowbtn = document.createElement("button");
        nextslideshowbtn.classList.add('slideshowNext');
        nextslideshowbtn.innerText = "❯";
        slideshowbtns.insertAdjacentElement('beforeend', nextslideshowbtn);
        slideshowbtns.style.display = "flex";
        slideshowbtns.style.justifyContent = "center";
        //Update slideshow object
        aaslideshow.nextbtn = nextslideshowbtn;

        //Hide overflow elements
        if (aaslideshow.cardindxstart < aaslideshow.cardquantshow){
            for(let i = aaslideshow.cards.length - 1; i > aaslideshow.cardsindxend; i--){
                aaslideshow.cards[i].style.position = "absolute";
                aaslideshow.cards[i].style.opacity = "0%";
                aaslideshow.cards[i].style.display = "none";
                    aaslideshow.cards[i].style.transform = "translateX(182.5px)";
                    continue;
            }
        }

        //Next/previous button event listeners
        aaslideshow.nextbtn.addEventListener("click", (e) => {
            e.preventDefault();
            CardsSlideShow.next(aaslideshow);
            numberelementtext();
        })
        aaslideshow.prevbtn.addEventListener("click", (e) => {
            e.preventDefault();
            CardsSlideShow.prev(aaslideshow);
            numberelementtext();
        })
    },
    next: (slideshow: typeof CardsSlideShow) => {
        if (slideshow.turn == slideshow.maxturncount){
            return;
        }
        //Hide the first element in slideshow
        slideshow.cards[slideshow.cardindxstart].style.opacity = "0%";
        slideshow.cards[slideshow.cardindxstart].style.display = "none";
        //Move the right element to left
        slideshow.cards[slideshow.cardindxstart+1].style.transform = "translateX(0px)";
        //Move in new element
        slideshow.cards[slideshow.cardsindxend+1].style.transform = "translateX(350px)";
        slideshow.cards[slideshow.cardsindxend+1].style.display = "block";
        //Display the next element for slideshow
        slideshow.cards[slideshow.cardsindxend+1].style.opacity = "100%";

        //Increment index counter
        slideshow.cardindxstart++;
        slideshow.cardsindxend++;
        slideshow.turn++;
        slideshow.cardcounter++;
    },
    prev: (slideshow: typeof CardsSlideShow) => {
        if(slideshow.turn == 0){
            return;
        }
        //Hide the last element in slideshow
        slideshow.cards[slideshow.cardsindxend].style.opacity = "0%";
        slideshow.cards[slideshow.cardsindxend].style.display = "none";
        //Move left element to the right
        slideshow.cards[slideshow.cardindxstart].style.transform = "translateX(350px)";
        //Display the next element for slideshow
        slideshow.cards[slideshow.cardindxstart - 1].style.display = "block";
        slideshow.cards[slideshow.cardindxstart - 1].style.opacity = "100%";
        //Move in new element
        slideshow.cards[slideshow.cardindxstart - 1].style.transform = "translateX(0px)";

        //Increment index counter
        slideshow.cardindxstart--;
        slideshow.cardsindxend--;
        slideshow.turn--;
        slideshow.cardcounter--;
    }
}

CardsSlideShow.init();