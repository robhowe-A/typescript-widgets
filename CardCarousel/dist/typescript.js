(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
//--Copyright (c) 2023 Robert A. Howell
Object.defineProperty(exports, "__esModule", { value: true });
class SlideShow {
    cards;
    cardquantshow;
    cardindxstart = 0;
    cardcounter = 1;
    cardsindxend;
    turn = 0;
    maxturncount;
    slideshowcontainer = document.querySelector(".slideshow");
    prevbtn;
    nextbtn;
    numberElement;
    constructor(cards, quantityshow) {
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
        this.numberElementText();
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
        this.numberElementText();
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
exports.default = SlideShow;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//--Copyright (c) 2023 Robert A. Howell
const CardSlideShow_1 = require("./CardSlideShow");
const CardsSlideShow = {
    init: () => {
        let aacards = document.querySelectorAll(".slideshow .slide");
        //Implement slideshow
        let slideshow;
        slideshow = new CardSlideShow_1.default(aacards, 2);
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

},{"./CardSlideShow":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FyZFNsaWRlU2hvdy50cyIsInNyYy9DYXJkc1NsaWRlc2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSx1Q0FBdUM7O0FBRXZDLE1BQXFCLFNBQVM7SUFDNUIsS0FBSyxDQUE2QjtJQUNsQyxhQUFhLENBQVM7SUFDdEIsYUFBYSxHQUFXLENBQUMsQ0FBQztJQUMxQixXQUFXLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFlBQVksQ0FBUztJQUNyQixJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ2pCLFlBQVksQ0FBUztJQUNyQixrQkFBa0IsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQWdCLENBQUM7SUFDdEYsT0FBTyxDQUFjO0lBQ3JCLE9BQU8sQ0FBYztJQUNyQixhQUFhLENBQWM7SUFFM0IsWUFBWSxLQUFpQyxFQUFFLFlBQW9CO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzdELENBQUM7SUFDRCwyQ0FBMkM7SUFDM0MsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkMsT0FBTztRQUNULENBQUM7UUFDRCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENB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RyxJQUFJLENBQUM7Z0JBQzlDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQ2hELGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztnQkFDakUsU0FBUztZQUNYLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUM7QUFFRixjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLy0tQ29weXJpZ2h0IChjKSAyMDIzIFJvYmVydCBBLiBIb3dlbGxcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlU2hvdyB7XHJcbiAgY2FyZHM6IE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG4gIGNhcmRxdWFudHNob3c6IG51bWJlcjtcclxuICBjYXJkaW5keHN0YXJ0OiBudW1iZXIgPSAwO1xyXG4gIGNhcmRjb3VudGVyOiBudW1iZXIgPSAxO1xyXG4gIGNhcmRzaW5keGVuZDogbnVtYmVyO1xyXG4gIHR1cm46IG51bWJlciA9IDA7XHJcbiAgbWF4dHVybmNvdW50OiBudW1iZXI7XHJcbiAgc2xpZGVzaG93Y29udGFpbmVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVzaG93XCIpIGFzIEhUTUxFbGVtZW50O1xyXG4gIHByZXZidG46IEhUTUxFbGVtZW50O1xyXG4gIG5leHRidG46IEhUTUxFbGVtZW50O1xyXG4gIG51bWJlckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcihjYXJkczogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD4sIHF1YW50aXR5c2hvdzogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNhcmRzID0gY2FyZHM7XHJcbiAgICB0aGlzLmNhcmRxdWFudHNob3cgPSBxdWFudGl0eXNob3c7XHJcbiAgICB0aGlzLmNhcmRzaW5keGVuZCA9IHRoaXMuY2FyZHF1YW50c2hvdyAtIDE7XHJcbiAgICB0aGlzLm1heHR1cm5jb3VudCA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gdGhpcy5jYXJkcXVhbnRzaG93O1xyXG4gIH1cclxuICAvKipCcmluZ3MgdmlzaWJsZSB0aGUgbmV4dCBzbGlkZSBlbGVtZW50ICovXHJcbiAgbmV4dCgpIHtcclxuICAgIGlmICh0aGlzLnR1cm4gPT0gdGhpcy5tYXh0dXJuY291bnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy9IaWRlIHRoZSBmaXJzdCBlbGVtZW50IGluIHNsaWRlc2hvd1xyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRpbmR4c3RhcnRdLnN0eWxlLm9wYWNpdHkgPSBcIjAlXCI7XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZGluZHhzdGFydF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgLy9Nb3ZlIHRoZSByaWdodCBlbGVtZW50IHRvIGxlZnRcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkaW5keHN0YXJ0ICsgMV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDEwMHB4KVwiO1xyXG4gICAgLy9Nb3ZlIGluIG5ldyBlbGVtZW50XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNpbmR4ZW5kICsgMV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDMwMHB4KVwiO1xyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRzaW5keGVuZCArIDFdLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAvL0Rpc3BsYXkgdGhlIG5leHQgZWxlbWVudCBmb3Igc2xpZGVzaG93XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNpbmR4ZW5kICsgMV0uc3R5bGUub3BhY2l0eSA9IFwiMTAwJVwiO1xyXG5cclxuICAgIC8vSW5jcmVtZW50IGluZGV4IGNvdW50ZXJcclxuICAgIHRoaXMuY2FyZGluZHhzdGFydCsrO1xyXG4gICAgdGhpcy5jYXJkc2luZHhlbmQrKztcclxuICAgIHRoaXMudHVybisrO1xyXG4gICAgdGhpcy5jYXJkY291bnRlcisrO1xyXG5cclxuICAgIHRoaXMubnVtYmVyRWxlbWVudFRleHQoKTtcclxuICB9XHJcbiAgLyoqSGlkZXMgcHJldmlvdXMgc2xpZGUgZWxlbWVudCAqL1xyXG4gIHByZXZpb3VzKCkge1xyXG4gICAgaWYgKHRoaXMudHVybiA9PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vSGlkZSB0aGUgbGFzdCBlbGVtZW50IGluIHNsaWRlc2hvd1xyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRzaW5keGVuZF0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkc2luZHhlbmRdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAvL01vdmUgbGVmdCBlbGVtZW50IHRvIHRoZSByaWdodFxyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRpbmR4c3RhcnRdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgzMDBweClcIjtcclxuXHJcbiAgICAvL0Rpc3BsYXkgdGhlIG5leHQgZWxlbWVudCBmb3Igc2xpZGVzaG93XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZGluZHhzdGFydCAtIDFdLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZGluZHhzdGFydCAtIDFdLnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcclxuXHJcbiAgICAvL01vdmUgaW4gbmV3IGVsZW1lbnRcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkaW5keHN0YXJ0IC0gMV0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDEwMHB4KVwiO1xyXG5cclxuICAgIC8vSW5jcmVtZW50IGluZGV4IGNvdW50ZXJcclxuICAgIHRoaXMuY2FyZGluZHhzdGFydC0tO1xyXG4gICAgdGhpcy5jYXJkc2luZHhlbmQtLTtcclxuICAgIHRoaXMudHVybi0tO1xyXG4gICAgdGhpcy5jYXJkY291bnRlci0tO1xyXG5cclxuICAgIHRoaXMubnVtYmVyRWxlbWVudFRleHQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbnVtYmVyRWxlbWVudFRleHQoKSB7XHJcbiAgICAvL0NoYW5nZSB0aGUgdGV4dCB2aXNpYmxlIHdoZW4gbmV4dCBvciBwcmV2aW91cyBpcyBjbGlja2VkXHJcbiAgICB0aGlzLm51bWJlckVsZW1lbnQuaW5uZXJUZXh0ID1cclxuICAgICAgXCJbXCIgK1xyXG4gICAgICB0aGlzLmNhcmRjb3VudGVyLnRvU3RyaW5nKCkgK1xyXG4gICAgICBcIi4uXCIgK1xyXG4gICAgICAodGhpcy5jYXJkY291bnRlciArIHRoaXMuY2FyZHF1YW50c2hvdyAtIDEpLnRvU3RyaW5nKCkgK1xyXG4gICAgICBcIl1cIiArXHJcbiAgICAgIFwiIG9mIFwiICtcclxuICAgICAgdGhpcy5jYXJkcy5sZW5ndGgudG9TdHJpbmcoKTtcclxuICB9XHJcbn1cclxuIiwiLy8tLUNvcHlyaWdodCAoYykgMjAyMyBSb2JlcnQgQS4gSG93ZWxsXHJcbmltcG9ydCBTbGlkZVNob3cgZnJvbSBcIi4vQ2FyZFNsaWRlU2hvd1wiO1xyXG5cclxuY29uc3QgQ2FyZHNTbGlkZVNob3cgPSB7XHJcbiAgaW5pdDogKCkgPT4ge1xyXG4gICAgbGV0IGFhY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlc2hvdyAuc2xpZGVcIikgYXMgTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gICAgLy9JbXBsZW1lbnQgc2xpZGVzaG93XHJcbiAgICBsZXQgc2xpZGVzaG93OiBTbGlkZVNob3c7XHJcbiAgICBzbGlkZXNob3cgPSBuZXcgU2xpZGVTaG93KGFhY2FyZHMsIDIpO1xyXG5cclxuICAgIC8vQnVpbGQgdGhlIG1hcmt1cCBuZWVkZWQgZm9yIHRoZSBzbGlkZXNob3dcclxuICAgIENhcmRzU2xpZGVTaG93LmFkZFNsaWRlU2hvd01hcmt1cChzbGlkZXNob3cpO1xyXG5cclxuICAgIC8vSGlkZSBvdmVyZmxvdyBlbGVtZW50c1xyXG4gICAgQ2FyZHNTbGlkZVNob3cuaGlkZU92ZXJmbG93RWxlbWVudHMoc2xpZGVzaG93KTtcclxuXHJcbiAgICAvL05leHQrcHJldmlvdXMgYnV0dG9uIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgc2xpZGVzaG93Lm5leHRidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNsaWRlc2hvdy5uZXh0KCk7XHJcbiAgICB9KTtcclxuICAgIHNsaWRlc2hvdy5wcmV2YnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzbGlkZXNob3cucHJldmlvdXMoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgYWRkU2xpZGVTaG93TWFya3VwOiBzbGlkZXNob3cgPT4ge1xyXG4gICAgLy9BZGQgdGhlIGNhcmRzIHRvIGEgbmV3IGNvbnRhaW5lclxyXG4gICAgbGV0IHNsaWRlc2hvd3NsaWRlcyA9IHNsaWRlc2hvdy5zbGlkZXNob3djb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XHJcbiAgICBmb3IgKGxldCBjYXJkIG9mIHNsaWRlc2hvdy5jYXJkcykge1xyXG4gICAgICBsZXQgdGVtcCA9IGNhcmQ7XHJcbiAgICAgIHNsaWRlc2hvd3NsaWRlcy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmVlbmRcIiwgdGVtcCk7XHJcbiAgICB9XHJcbiAgICAvL1N0eWxlIHRoZSBjb250YWluZXIgd2l0aCBmbGV4Ym94XHJcbiAgICBzbGlkZXNob3dzbGlkZXMuY2xhc3NMaXN0LmFkZChcInNsaWRlc2NvbnRhaW5lclwiKTtcclxuICAgIHNsaWRlc2hvd3NsaWRlcy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgc2xpZGVzaG93c2xpZGVzLnN0eWxlLmhlaWdodCA9IFwiMTBlbVwiO1xyXG4gICAgc2xpZGVzaG93c2xpZGVzLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIHNsaWRlc2hvd3NsaWRlcy5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIHNsaWRlc2hvdy5zbGlkZXNob3djb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xyXG5cclxuICAgIC8vQWRkIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnNcclxuICAgIGxldCBzbGlkZXNob3didG5zID0gc2xpZGVzaG93LnNsaWRlc2hvd2NvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcclxuXHJcbiAgICAvL0xlZnQgc2xpZGVzaG93IGJ0blxyXG4gICAgbGV0IHByZXZpb3Vzc2xpZGVzaG93YnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHByZXZpb3Vzc2xpZGVzaG93YnRuLmNsYXNzTGlzdC5hZGQoXCJzbGlkZXNob3dQcmV2XCIpO1xyXG4gICAgcHJldmlvdXNzbGlkZXNob3didG4uaW5uZXJUZXh0ID0gXCLina5cIjtcclxuICAgIHNsaWRlc2hvd2J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIHByZXZpb3Vzc2xpZGVzaG93YnRuKTtcclxuXHJcbiAgICAvL1VwZGF0ZSBzbGlkZXNob3cgb2JqZWN0XHJcbiAgICBzbGlkZXNob3cucHJldmJ0biA9IHByZXZpb3Vzc2xpZGVzaG93YnRuO1xyXG5cclxuICAgIC8vTnVtYmVyIGVsZW1lbnQ6IHVzZWQgdG8gc2hvdyB3aGF0IHNsaWRlcyBhcmUgcmV2ZWFsZWRcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudFRleHQoc2xpZGVzaG93KTtcclxuICAgIHByZXZpb3Vzc2xpZGVzaG93YnRuLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50KTtcclxuICAgIC8vTnVtYmVyIGVsZW1lbnQgc3R5bGVzXHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImdyaWRcIjtcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50LnN0eWxlLmFsaWduQ29udGVudCA9IFwiY2VudGVyXCI7XHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudC5zdHlsZS5tYXJnaW5JbmxpbmUgPSBcIjEuNXJlbVwiO1xyXG5cclxuICAgIC8vUmlnaHQgc2xpZGVzaG93IGJ0blxyXG4gICAgbGV0IG5leHRzbGlkZXNob3didG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgbmV4dHNsaWRlc2hvd2J0bi5jbGFzc0xpc3QuYWRkKFwic2xpZGVzaG93TmV4dFwiKTtcclxuICAgIG5leHRzbGlkZXNob3didG4uaW5uZXJUZXh0ID0gXCLina9cIjtcclxuICAgIHNsaWRlc2hvd2J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIG5leHRzbGlkZXNob3didG4pO1xyXG4gICAgc2xpZGVzaG93YnRucy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBzbGlkZXNob3didG5zLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcclxuICAgIC8vVXBkYXRlIHNsaWRlc2hvdyBvYmplY3RcclxuICAgIHNsaWRlc2hvdy5uZXh0YnRuID0gbmV4dHNsaWRlc2hvd2J0bjtcclxuICB9LFxyXG5cclxuICBoaWRlT3ZlcmZsb3dFbGVtZW50czogc2xpZGVzaG93d2lkZ2V0ID0+IHtcclxuICAgIGlmIChzbGlkZXNob3d3aWRnZXQuY2FyZGluZHhzdGFydCA8IHNsaWRlc2hvd3dpZGdldC5jYXJkcXVhbnRzaG93KSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzbGlkZXNob3d3aWRnZXQuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IHNsaWRlc2hvd3dpZGdldC5jYXJkc2luZHhlbmQ7IGktLSkge1xyXG4gICAgICAgIHNsaWRlc2hvd3dpZGdldC5jYXJkc1tpXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBzbGlkZXNob3d3aWRnZXQuY2FyZHNbaV0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcclxuICAgICAgICBzbGlkZXNob3d3aWRnZXQuY2FyZHNbaV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHNsaWRlc2hvd3dpZGdldC5jYXJkc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMTgyLjVweClcIjtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbn07XHJcblxyXG5DYXJkc1NsaWRlU2hvdy5pbml0KCk7XHJcbiJdfQ==
