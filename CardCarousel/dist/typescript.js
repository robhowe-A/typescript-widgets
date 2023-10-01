(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
//--Copyright (c) 2023 Robert A. Howell
Object.defineProperty(exports, "__esModule", { value: true });
class CardSlideShow {
    cards;
    cardquantshow;
    cardindxstart = 0;
    cardcounter = 1;
    cardsindxend;
    turn = 0;
    maxturncount;
    slideshowcontainer = document.querySelector(".cardslideshow");
    prevbtn;
    nextbtn;
    constructor(cards, quantityshow) {
        this.cards = cards;
        this.cardquantshow = quantityshow;
        this.cardsindxend = this.cardquantshow - 1;
        this.maxturncount = this.cards.length - this.cardquantshow;
    }
}
exports.default = CardSlideShow;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//--Copyright (c) 2023 Robert A. Howell
const CardSlideShow_1 = require("./CardSlideShow");
const CardsSlideShow = {
    init: () => {
        let aacards = document.querySelectorAll(".cardslideshow .slide");
        //Implement slideshow for arbitrary articles
        let aaslideshow;
        aaslideshow = new CardSlideShow_1.default(aacards, 2);
        //Build the markup needed for the slideshow
        //Add cards to container
        let slideshowslides = aaslideshow.slideshowcontainer.appendChild(document.createElement("div"));
        for (let card of aaslideshow.cards) {
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
        };
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
        if (aaslideshow.cardindxstart < aaslideshow.cardquantshow) {
            for (let i = aaslideshow.cards.length - 1; i > aaslideshow.cardsindxend; i--) {
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
        });
        aaslideshow.prevbtn.addEventListener("click", (e) => {
            e.preventDefault();
            CardsSlideShow.prev(aaslideshow);
            numberelementtext();
        });
    },
    next: (slideshow) => {
        if (slideshow.turn == slideshow.maxturncount) {
            return;
        }
        //Hide the first element in slideshow
        slideshow.cards[slideshow.cardindxstart].style.opacity = "0%";
        slideshow.cards[slideshow.cardindxstart].style.display = "none";
        //Move the right element to left
        slideshow.cards[slideshow.cardindxstart + 1].style.transform = "translateX(0px)";
        //Move in new element
        slideshow.cards[slideshow.cardsindxend + 1].style.transform = "translateX(350px)";
        slideshow.cards[slideshow.cardsindxend + 1].style.display = "block";
        //Display the next element for slideshow
        slideshow.cards[slideshow.cardsindxend + 1].style.opacity = "100%";
        //Increment index counter
        slideshow.cardindxstart++;
        slideshow.cardsindxend++;
        slideshow.turn++;
        slideshow.cardcounter++;
    },
    prev: (slideshow) => {
        if (slideshow.turn == 0) {
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
};
CardsSlideShow.init();

},{"./CardSlideShow":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FyZFNsaWRlU2hvdy50cyIsInNyYy9DYXJkc1NsaWRlc2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSx1Q0FBdUM7O0FBRXZDLE1BQXFCLGFBQWE7SUFDOUIsS0FBSyxDQUE0QjtJQUNqQyxhQUFhLENBQVM7SUFDdEIsYUFBYSxHQUFXLENBQUMsQ0FBQztJQUMxQixXQUFXLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFlBQVksQ0FBUztJQUNyQixJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ2pCLFlBQVksQ0FBUztJQUNyQixrQkFBa0IsR0FBZSxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFnQixDQUFDO0lBQ3pGLE9BQU8sQ0FBYztJQUNyQixPQUFPLENBQWM7SUFFckIsWUFBYSxLQUFpQyxFQUFFLFlBQW9CO1FBQ2hFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQy9ELENBQUM7Q0FDSjtBQWxCRCxnQ0FrQkM7Ozs7O0FDcEJELHVDQUF1QztBQUN2QyxtREFBNEM7QUFFNUMsTUFBTSxjQUFjLEdBQUc7SUFDbkIsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUNQLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBK0IsQ0FBQztRQUUvRiw0Q0FBNEM7UUFDNUMsSUFBSSxXQUEwQixDQUFDO1FBQy9CLFdBQVcsR0FBRyxJQUFJLHVCQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTVDLDJD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bnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vLS1Db3B5cmlnaHQgKGMpIDIwMjMgUm9iZXJ0IEEuIEhvd2VsbFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYXJkU2xpZGVTaG93IHtcbiAgICBjYXJkczpOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PjtcbiAgICBjYXJkcXVhbnRzaG93OiBudW1iZXI7XG4gICAgY2FyZGluZHhzdGFydDogbnVtYmVyID0gMDtcbiAgICBjYXJkY291bnRlcjogbnVtYmVyID0gMTtcbiAgICBjYXJkc2luZHhlbmQ6IG51bWJlcjtcbiAgICB0dXJuOiBudW1iZXIgPSAwO1xuICAgIG1heHR1cm5jb3VudDogbnVtYmVyO1xuICAgIHNsaWRlc2hvd2NvbnRhaW5lcjpIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FyZHNsaWRlc2hvd1wiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBwcmV2YnRuOiBIVE1MRWxlbWVudDtcbiAgICBuZXh0YnRuOiBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yIChjYXJkczogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4sIHF1YW50aXR5c2hvdzogbnVtYmVyKXtcbiAgICAgICAgdGhpcy5jYXJkcyA9IGNhcmRzO1xuICAgICAgICB0aGlzLmNhcmRxdWFudHNob3cgPSBxdWFudGl0eXNob3c7XG4gICAgICAgIHRoaXMuY2FyZHNpbmR4ZW5kID0gdGhpcy5jYXJkcXVhbnRzaG93IC0gMTtcbiAgICAgICAgdGhpcy5tYXh0dXJuY291bnQgPSB0aGlzLmNhcmRzLmxlbmd0aCAtIHRoaXMuY2FyZHF1YW50c2hvdztcbiAgICB9XG59IiwiLy8tLUNvcHlyaWdodCAoYykgMjAyMyBSb2JlcnQgQS4gSG93ZWxsXG5pbXBvcnQgQ2FyZFNsaWRlU2hvdyBmcm9tIFwiLi9DYXJkU2xpZGVTaG93XCI7XG5cbmNvbnN0IENhcmRzU2xpZGVTaG93ID0ge1xuICAgIGluaXQ6ICgpID0+IHtcbiAgICAgICAgbGV0IGFhY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRzbGlkZXNob3cgLnNsaWRlXCIpIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgICAgIC8vSW1wbGVtZW50IHNsaWRlc2hvdyBmb3IgYXJiaXRyYXJ5IGFydGljbGVzXG4gICAgICAgIGxldCBhYXNsaWRlc2hvdzogQ2FyZFNsaWRlU2hvdztcbiAgICAgICAgYWFzbGlkZXNob3cgPSBuZXcgQ2FyZFNsaWRlU2hvdyhhYWNhcmRzLCAyKTtcblxuICAgICAgICAvL0J1aWxkIHRoZSBtYXJrdXAgbmVlZGVkIGZvciB0aGUgc2xpZGVzaG93XG4gICAgICAgIC8vQWRkIGNhcmRzIHRvIGNvbnRhaW5lclxuICAgICAgICBsZXQgc2xpZGVzaG93c2xpZGVzID0gYWFzbGlkZXNob3cuc2xpZGVzaG93Y29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICBmb3IgKGxldCBjYXJkIG9mIGFhc2xpZGVzaG93LmNhcmRzKXtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gY2FyZDtcbiAgICAgICAgICAgIHNsaWRlc2hvd3NsaWRlcy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmVlbmRcIiwgdGVtcCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9Db250YWluZXIgc3R5bGVzXG4gICAgICAgIHNsaWRlc2hvd3NsaWRlcy5jbGFzc0xpc3QuYWRkKFwic2xpZGVzY29udGFpbmVyXCIpO1xuICAgICAgICBzbGlkZXNob3dzbGlkZXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgc2xpZGVzaG93c2xpZGVzLnN0eWxlLmhlaWdodCA9IFwiMzJlbVwiO1xuICAgICAgICBzbGlkZXNob3dzbGlkZXMuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBzbGlkZXNob3dzbGlkZXMuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICAgIGFhc2xpZGVzaG93LnNsaWRlc2hvd2NvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgICAgIC8vQWRkIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnNcbiAgICAgICAgbGV0IHNsaWRlc2hvd2J0bnMgPSBhYXNsaWRlc2hvdy5zbGlkZXNob3djb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG5cbiAgICAgICAgLy9MZWZ0IHNsaWRlc2hvdyBidG5cbiAgICAgICAgbGV0IHByZXZpb3Vzc2xpZGVzaG93YnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgcHJldmlvdXNzbGlkZXNob3didG4uY2xhc3NMaXN0LmFkZCgnc2xpZGVzaG93UHJldicpO1xuICAgICAgICBwcmV2aW91c3NsaWRlc2hvd2J0bi5pbm5lclRleHQgPSBcIuKdrlwiO1xuICAgICAgICBzbGlkZXNob3didG5zLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlZW5kJywgcHJldmlvdXNzbGlkZXNob3didG4pO1xuICAgICAgICAvL1VwZGF0ZSBzbGlkZXNob3cgb2JqZWN0XG4gICAgICAgIGFhc2xpZGVzaG93LnByZXZidG4gPSBwcmV2aW91c3NsaWRlc2hvd2J0bjtcblxuICAgICAgICAvL051bWJlciBlbGVtZW50XG4gICAgICAgIGxldCBudW1iZXJlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IG51bWJlcmVsZW1lbnR0ZXh0ID0gKCkgPT4ge1xuICAgICAgICAgICAgbnVtYmVyZWxlbWVudC5pbm5lclRleHQgPSBcIltcIiArIGFhc2xpZGVzaG93LmNhcmRjb3VudGVyLnRvU3RyaW5nKCkgKyBcIi4uXCIgKyBcbiAgICAgICAgICAgIChhYXNsaWRlc2hvdy5jYXJkY291bnRlciArIGFhc2xpZGVzaG93LmNhcmRxdWFudHNob3cgLSAxKS50b1N0cmluZygpICsgXCJdXCIgKyBcIiBvZiBcIiArIGFhc2xpZGVzaG93LmNhcmRzLmxlbmd0aC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlcmVsZW1lbnR0ZXh0KCk7XG4gICAgICAgIHByZXZpb3Vzc2xpZGVzaG93YnRuLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBudW1iZXJlbGVtZW50KTtcbiAgICAgICAgbnVtYmVyZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgbnVtYmVyZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gICAgICAgIG51bWJlcmVsZW1lbnQuc3R5bGUuYWxpZ25Db250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICAgICAgbnVtYmVyZWxlbWVudC5zdHlsZS5tYXJnaW5JbmxpbmUgPSBcIjEuNXJlbVwiO1xuXG4gICAgICAgIC8vUmlnaHQgc2xpZGVzaG93IGJ0blxuICAgICAgICBsZXQgbmV4dHNsaWRlc2hvd2J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIG5leHRzbGlkZXNob3didG4uY2xhc3NMaXN0LmFkZCgnc2xpZGVzaG93TmV4dCcpO1xuICAgICAgICBuZXh0c2xpZGVzaG93YnRuLmlubmVyVGV4dCA9IFwi4p2vXCI7XG4gICAgICAgIHNsaWRlc2hvd2J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmVlbmQnLCBuZXh0c2xpZGVzaG93YnRuKTtcbiAgICAgICAgc2xpZGVzaG93YnRucy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIHNsaWRlc2hvd2J0bnMuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICAvL1VwZGF0ZSBzbGlkZXNob3cgb2JqZWN0XG4gICAgICAgIGFhc2xpZGVzaG93Lm5leHRidG4gPSBuZXh0c2xpZGVzaG93YnRuO1xuXG4gICAgICAgIC8vSGlkZSBvdmVyZmxvdyBlbGVtZW50c1xuICAgICAgICBpZiAoYWFzbGlkZXNob3cuY2FyZGluZHhzdGFydCA8IGFhc2xpZGVzaG93LmNhcmRxdWFudHNob3cpe1xuICAgICAgICAgICAgZm9yKGxldCBpID0gYWFzbGlkZXNob3cuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IGFhc2xpZGVzaG93LmNhcmRzaW5keGVuZDsgaS0tKXtcbiAgICAgICAgICAgICAgICBhYXNsaWRlc2hvdy5jYXJkc1tpXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgICAgICBhYXNsaWRlc2hvdy5jYXJkc1tpXS5zdHlsZS5vcGFjaXR5ID0gXCIwJVwiO1xuICAgICAgICAgICAgICAgIGFhc2xpZGVzaG93LmNhcmRzW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgYWFzbGlkZXNob3cuY2FyZHNbaV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDE4Mi41cHgpXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9OZXh0L3ByZXZpb3VzIGJ1dHRvbiBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgYWFzbGlkZXNob3cubmV4dGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIENhcmRzU2xpZGVTaG93Lm5leHQoYWFzbGlkZXNob3cpO1xuICAgICAgICAgICAgbnVtYmVyZWxlbWVudHRleHQoKTtcbiAgICAgICAgfSlcbiAgICAgICAgYWFzbGlkZXNob3cucHJldmJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIENhcmRzU2xpZGVTaG93LnByZXYoYWFzbGlkZXNob3cpO1xuICAgICAgICAgICAgbnVtYmVyZWxlbWVudHRleHQoKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG5leHQ6IChzbGlkZXNob3c6IHR5cGVvZiBDYXJkc1NsaWRlU2hvdykgPT4ge1xuICAgICAgICBpZiAoc2xpZGVzaG93LnR1cm4gPT0gc2xpZGVzaG93Lm1heHR1cm5jb3VudCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy9IaWRlIHRoZSBmaXJzdCBlbGVtZW50IGluIHNsaWRlc2hvd1xuICAgICAgICBzbGlkZXNob3cuY2FyZHNbc2xpZGVzaG93LmNhcmRpbmR4c3RhcnRdLnN0eWxlLm9wYWNpdHkgPSBcIjAlXCI7XG4gICAgICAgIHNsaWRlc2hvdy5jYXJkc1tzbGlkZXNob3cuY2FyZGluZHhzdGFydF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAvL01vdmUgdGhlIHJpZ2h0IGVsZW1lbnQgdG8gbGVmdFxuICAgICAgICBzbGlkZXNob3cuY2FyZHNbc2xpZGVzaG93LmNhcmRpbmR4c3RhcnQrMV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDBweClcIjtcbiAgICAgICAgLy9Nb3ZlIGluIG5ldyBlbGVtZW50XG4gICAgICAgIHNsaWRlc2hvdy5jYXJkc1tzbGlkZXNob3cuY2FyZHNpbmR4ZW5kKzFdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgzNTBweClcIjtcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkc2luZHhlbmQrMV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgLy9EaXNwbGF5IHRoZSBuZXh0IGVsZW1lbnQgZm9yIHNsaWRlc2hvd1xuICAgICAgICBzbGlkZXNob3cuY2FyZHNbc2xpZGVzaG93LmNhcmRzaW5keGVuZCsxXS5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG5cbiAgICAgICAgLy9JbmNyZW1lbnQgaW5kZXggY291bnRlclxuICAgICAgICBzbGlkZXNob3cuY2FyZGluZHhzdGFydCsrO1xuICAgICAgICBzbGlkZXNob3cuY2FyZHNpbmR4ZW5kKys7XG4gICAgICAgIHNsaWRlc2hvdy50dXJuKys7XG4gICAgICAgIHNsaWRlc2hvdy5jYXJkY291bnRlcisrO1xuICAgIH0sXG4gICAgcHJldjogKHNsaWRlc2hvdzogdHlwZW9mIENhcmRzU2xpZGVTaG93KSA9PiB7XG4gICAgICAgIGlmKHNsaWRlc2hvdy50dXJuID09IDApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vSGlkZSB0aGUgbGFzdCBlbGVtZW50IGluIHNsaWRlc2hvd1xuICAgICAgICBzbGlkZXNob3cuY2FyZHNbc2xpZGVzaG93LmNhcmRzaW5keGVuZF0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkc2luZHhlbmRdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgLy9Nb3ZlIGxlZnQgZWxlbWVudCB0byB0aGUgcmlnaHRcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkaW5keHN0YXJ0XS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMzUwcHgpXCI7XG4gICAgICAgIC8vRGlzcGxheSB0aGUgbmV4dCBlbGVtZW50IGZvciBzbGlkZXNob3dcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkaW5keHN0YXJ0IC0gMV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkaW5keHN0YXJ0IC0gMV0uc3R5bGUub3BhY2l0eSA9IFwiMTAwJVwiO1xuICAgICAgICAvL01vdmUgaW4gbmV3IGVsZW1lbnRcbiAgICAgICAgc2xpZGVzaG93LmNhcmRzW3NsaWRlc2hvdy5jYXJkaW5keHN0YXJ0IC0gMV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDBweClcIjtcblxuICAgICAgICAvL0luY3JlbWVudCBpbmRleCBjb3VudGVyXG4gICAgICAgIHNsaWRlc2hvdy5jYXJkaW5keHN0YXJ0LS07XG4gICAgICAgIHNsaWRlc2hvdy5jYXJkc2luZHhlbmQtLTtcbiAgICAgICAgc2xpZGVzaG93LnR1cm4tLTtcbiAgICAgICAgc2xpZGVzaG93LmNhcmRjb3VudGVyLS07XG4gICAgfVxufVxuXG5DYXJkc1NsaWRlU2hvdy5pbml0KCk7Il19
