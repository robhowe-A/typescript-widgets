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
            slideshow.numberElementText();
        });
        slideshow.prevbtn.addEventListener("click", e => {
            e.preventDefault();
            slideshow.previous();
            slideshow.numberElementText();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FyZFNsaWRlU2hvdy50cyIsInNyYy9DYXJkc1NsaWRlc2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSx1Q0FBdUM7O0FBRXZDLE1BQXFCLFNBQVM7SUFDNUIsS0FBSyxDQUE2QjtJQUNsQyxhQUFhLENBQVM7SUFDdEIsYUFBYSxHQUFXLENBQUMsQ0FBQztJQUMxQixXQUFXLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFlBQVksQ0FBUztJQUNyQixJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ2pCLFlBQVksQ0FBUztJQUNyQixrQkFBa0IsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQWdCLENBQUM7SUFDdEYsT0FBTyxDQUFjO0lBQ3JCLE9BQU8sQ0FBYztJQUNyQixhQUFhLENBQWM7SUFFM0IsWUFBWSxLQUFpQyxFQUFFLFlBQW9CO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzdELENBQUM7SUFDRCwyQ0FBMkM7SUFDM0MsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkMsT0FBTztRQUNULENBQUM7UUFDRCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENB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LElBQUksQ0FBQztnQkFDOUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztnQkFDaEQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDO2dCQUNqRSxTQUFTO1lBQ1gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQztBQUVGLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vLS1Db3B5cmlnaHQgKGMpIDIwMjMgUm9iZXJ0IEEuIEhvd2VsbFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVTaG93IHtcclxuICBjYXJkczogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XHJcbiAgY2FyZHF1YW50c2hvdzogbnVtYmVyO1xyXG4gIGNhcmRpbmR4c3RhcnQ6IG51bWJlciA9IDA7XHJcbiAgY2FyZGNvdW50ZXI6IG51bWJlciA9IDE7XHJcbiAgY2FyZHNpbmR4ZW5kOiBudW1iZXI7XHJcbiAgdHVybjogbnVtYmVyID0gMDtcclxuICBtYXh0dXJuY291bnQ6IG51bWJlcjtcclxuICBzbGlkZXNob3djb250YWluZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXNob3dcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgcHJldmJ0bjogSFRNTEVsZW1lbnQ7XHJcbiAgbmV4dGJ0bjogSFRNTEVsZW1lbnQ7XHJcbiAgbnVtYmVyRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNhcmRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiwgcXVhbnRpdHlzaG93OiBudW1iZXIpIHtcclxuICAgIHRoaXMuY2FyZHMgPSBjYXJkcztcclxuICAgIHRoaXMuY2FyZHF1YW50c2hvdyA9IHF1YW50aXR5c2hvdztcclxuICAgIHRoaXMuY2FyZHNpbmR4ZW5kID0gdGhpcy5jYXJkcXVhbnRzaG93IC0gMTtcclxuICAgIHRoaXMubWF4dHVybmNvdW50ID0gdGhpcy5jYXJkcy5sZW5ndGggLSB0aGlzLmNhcmRxdWFudHNob3c7XHJcbiAgfVxyXG4gIC8qKkJyaW5ncyB2aXNpYmxlIHRoZSBuZXh0IHNsaWRlIGVsZW1lbnQgKi9cclxuICBuZXh0KCkge1xyXG4gICAgaWYgKHRoaXMudHVybiA9PSB0aGlzLm1heHR1cm5jb3VudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvL0hpZGUgdGhlIGZpcnN0IGVsZW1lbnQgaW4gc2xpZGVzaG93XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZGluZHhzdGFydF0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkaW5keHN0YXJ0XS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAvL01vdmUgdGhlIHJpZ2h0IGVsZW1lbnQgdG8gbGVmdFxyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRpbmR4c3RhcnQgKyAxXS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMTAwcHgpXCI7XHJcbiAgICAvL01vdmUgaW4gbmV3IGVsZW1lbnRcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkc2luZHhlbmQgKyAxXS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMzAwcHgpXCI7XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNpbmR4ZW5kICsgMV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIC8vRGlzcGxheSB0aGUgbmV4dCBlbGVtZW50IGZvciBzbGlkZXNob3dcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkc2luZHhlbmQgKyAxXS5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XHJcblxyXG4gICAgLy9JbmNyZW1lbnQgaW5kZXggY291bnRlclxyXG4gICAgdGhpcy5jYXJkaW5keHN0YXJ0Kys7XHJcbiAgICB0aGlzLmNhcmRzaW5keGVuZCsrO1xyXG4gICAgdGhpcy50dXJuKys7XHJcbiAgICB0aGlzLmNhcmRjb3VudGVyKys7XHJcbiAgfVxyXG4gIC8qKkhpZGVzIHByZXZpb3VzIHNsaWRlIGVsZW1lbnQgKi9cclxuICBwcmV2aW91cygpIHtcclxuICAgIGlmICh0aGlzLnR1cm4gPT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvL0hpZGUgdGhlIGxhc3QgZWxlbWVudCBpbiBzbGlkZXNob3dcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkc2luZHhlbmRdLnN0eWxlLm9wYWNpdHkgPSBcIjAlXCI7XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNpbmR4ZW5kXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgLy9Nb3ZlIGxlZnQgZWxlbWVudCB0byB0aGUgcmlnaHRcclxuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkaW5keHN0YXJ0XS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMzAwcHgpXCI7XHJcblxyXG4gICAgLy9EaXNwbGF5IHRoZSBuZXh0IGVsZW1lbnQgZm9yIHNsaWRlc2hvd1xyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRpbmR4c3RhcnQgLSAxXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRpbmR4c3RhcnQgLSAxXS5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XHJcblxyXG4gICAgLy9Nb3ZlIGluIG5ldyBlbGVtZW50XHJcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZGluZHhzdGFydCAtIDFdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgxMDBweClcIjtcclxuXHJcbiAgICAvL0luY3JlbWVudCBpbmRleCBjb3VudGVyXHJcbiAgICB0aGlzLmNhcmRpbmR4c3RhcnQtLTtcclxuICAgIHRoaXMuY2FyZHNpbmR4ZW5kLS07XHJcbiAgICB0aGlzLnR1cm4tLTtcclxuICAgIHRoaXMuY2FyZGNvdW50ZXItLTtcclxuICB9XHJcblxyXG4gIG51bWJlckVsZW1lbnRUZXh0KCkge1xyXG4gICAgLy9DaGFuZ2UgdGhlIHRleHQgdmlzaWJsZSB3aGVuIG5leHQgb3IgcHJldmlvdXMgaXMgY2xpY2tlZFxyXG4gICAgdGhpcy5udW1iZXJFbGVtZW50LmlubmVyVGV4dCA9XHJcbiAgICAgIFwiW1wiICtcclxuICAgICAgdGhpcy5jYXJkY291bnRlci50b1N0cmluZygpICtcclxuICAgICAgXCIuLlwiICtcclxuICAgICAgKHRoaXMuY2FyZGNvdW50ZXIgKyB0aGlzLmNhcmRxdWFudHNob3cgLSAxKS50b1N0cmluZygpICtcclxuICAgICAgXCJdXCIgK1xyXG4gICAgICBcIiBvZiBcIiArXHJcbiAgICAgIHRoaXMuY2FyZHMubGVuZ3RoLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vLS1Db3B5cmlnaHQgKGMpIDIwMjMgUm9iZXJ0IEEuIEhvd2VsbFxyXG5pbXBvcnQgU2xpZGVTaG93IGZyb20gXCIuL0NhcmRTbGlkZVNob3dcIjtcclxuXHJcbmNvbnN0IENhcmRzU2xpZGVTaG93ID0ge1xyXG4gIGluaXQ6ICgpID0+IHtcclxuICAgIGxldCBhYWNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXNob3cgLnNsaWRlXCIpIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAgIC8vSW1wbGVtZW50IHNsaWRlc2hvd1xyXG4gICAgbGV0IHNsaWRlc2hvdzogU2xpZGVTaG93O1xyXG4gICAgc2xpZGVzaG93ID0gbmV3IFNsaWRlU2hvdyhhYWNhcmRzLCAyKTtcclxuXHJcbiAgICAvL0J1aWxkIHRoZSBtYXJrdXAgbmVlZGVkIGZvciB0aGUgc2xpZGVzaG93XHJcbiAgICBDYXJkc1NsaWRlU2hvdy5hZGRTbGlkZVNob3dNYXJrdXAoc2xpZGVzaG93KTtcclxuXHJcbiAgICAvL0hpZGUgb3ZlcmZsb3cgZWxlbWVudHNcclxuICAgIENhcmRzU2xpZGVTaG93LmhpZGVPdmVyZmxvd0VsZW1lbnRzKHNsaWRlc2hvdyk7XHJcblxyXG4gICAgLy9OZXh0K3ByZXZpb3VzIGJ1dHRvbiBldmVudCBsaXN0ZW5lcnNcclxuICAgIHNsaWRlc2hvdy5uZXh0YnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzbGlkZXNob3cubmV4dCgpO1xyXG4gICAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudFRleHQoKTtcclxuICAgIH0pO1xyXG4gICAgc2xpZGVzaG93LnByZXZidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNsaWRlc2hvdy5wcmV2aW91cygpO1xyXG4gICAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudFRleHQoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgYWRkU2xpZGVTaG93TWFya3VwOiBzbGlkZXNob3cgPT4ge1xyXG4gICAgLy9BZGQgdGhlIGNhcmRzIHRvIGEgbmV3IGNvbnRhaW5lclxyXG4gICAgbGV0IHNsaWRlc2hvd3NsaWRlcyA9IHNsaWRlc2hvdy5zbGlkZXNob3djb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XHJcbiAgICBmb3IgKGxldCBjYXJkIG9mIHNsaWRlc2hvdy5jYXJkcykge1xyXG4gICAgICBsZXQgdGVtcCA9IGNhcmQ7XHJcbiAgICAgIHNsaWRlc2hvd3NsaWRlcy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmVlbmRcIiwgdGVtcCk7XHJcbiAgICB9XHJcbiAgICAvL1N0eWxlIHRoZSBjb250YWluZXIgd2l0aCBmbGV4Ym94XHJcbiAgICBzbGlkZXNob3dzbGlkZXMuY2xhc3NMaXN0LmFkZChcInNsaWRlc2NvbnRhaW5lclwiKTtcclxuICAgIHNsaWRlc2hvd3NsaWRlcy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgc2xpZGVzaG93c2xpZGVzLnN0eWxlLmhlaWdodCA9IFwiMTBlbVwiO1xyXG4gICAgc2xpZGVzaG93c2xpZGVzLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIHNsaWRlc2hvd3NsaWRlcy5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIHNsaWRlc2hvdy5zbGlkZXNob3djb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xyXG5cclxuICAgIC8vQWRkIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnNcclxuICAgIGxldCBzbGlkZXNob3didG5zID0gc2xpZGVzaG93LnNsaWRlc2hvd2NvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcclxuXHJcbiAgICAvL0xlZnQgc2xpZGVzaG93IGJ0blxyXG4gICAgbGV0IHByZXZpb3Vzc2xpZGVzaG93YnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHByZXZpb3Vzc2xpZGVzaG93YnRuLmNsYXNzTGlzdC5hZGQoXCJzbGlkZXNob3dQcmV2XCIpO1xyXG4gICAgcHJldmlvdXNzbGlkZXNob3didG4uaW5uZXJUZXh0ID0gXCLina5cIjtcclxuICAgIHNsaWRlc2hvd2J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIHByZXZpb3Vzc2xpZGVzaG93YnRuKTtcclxuXHJcbiAgICAvL1VwZGF0ZSBzbGlkZXNob3cgb2JqZWN0XHJcbiAgICBzbGlkZXNob3cucHJldmJ0biA9IHByZXZpb3Vzc2xpZGVzaG93YnRuO1xyXG5cclxuICAgIC8vTnVtYmVyIGVsZW1lbnQ6IHVzZWQgdG8gc2hvdyB3aGF0IHNsaWRlcyBhcmUgcmV2ZWFsZWRcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudFRleHQoc2xpZGVzaG93KTtcclxuICAgIHByZXZpb3Vzc2xpZGVzaG93YnRuLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50KTtcclxuICAgIC8vTnVtYmVyIGVsZW1lbnQgc3R5bGVzXHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImdyaWRcIjtcclxuICAgIHNsaWRlc2hvdy5udW1iZXJFbGVtZW50LnN0eWxlLmFsaWduQ29udGVudCA9IFwiY2VudGVyXCI7XHJcbiAgICBzbGlkZXNob3cubnVtYmVyRWxlbWVudC5zdHlsZS5tYXJnaW5JbmxpbmUgPSBcIjEuNXJlbVwiO1xyXG5cclxuICAgIC8vUmlnaHQgc2xpZGVzaG93IGJ0blxyXG4gICAgbGV0IG5leHRzbGlkZXNob3didG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgbmV4dHNsaWRlc2hvd2J0bi5jbGFzc0xpc3QuYWRkKFwic2xpZGVzaG93TmV4dFwiKTtcclxuICAgIG5leHRzbGlkZXNob3didG4uaW5uZXJUZXh0ID0gXCLina9cIjtcclxuICAgIHNsaWRlc2hvd2J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIG5leHRzbGlkZXNob3didG4pO1xyXG4gICAgc2xpZGVzaG93YnRucy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBzbGlkZXNob3didG5zLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcclxuICAgIC8vVXBkYXRlIHNsaWRlc2hvdyBvYmplY3RcclxuICAgIHNsaWRlc2hvdy5uZXh0YnRuID0gbmV4dHNsaWRlc2hvd2J0bjtcclxuICB9LFxyXG5cclxuICBoaWRlT3ZlcmZsb3dFbGVtZW50czogc2xpZGVzaG93d2lkZ2V0ID0+IHtcclxuICAgIGlmIChzbGlkZXNob3d3aWRnZXQuY2FyZGluZHhzdGFydCA8IHNsaWRlc2hvd3dpZGdldC5jYXJkcXVhbnRzaG93KSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzbGlkZXNob3d3aWRnZXQuY2FyZHMubGVuZ3RoIC0gMTsgaSA+IHNsaWRlc2hvd3dpZGdldC5jYXJkc2luZHhlbmQ7IGktLSkge1xyXG4gICAgICAgIHNsaWRlc2hvd3dpZGdldC5jYXJkc1tpXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBzbGlkZXNob3d3aWRnZXQuY2FyZHNbaV0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcclxuICAgICAgICBzbGlkZXNob3d3aWRnZXQuY2FyZHNbaV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHNsaWRlc2hvd3dpZGdldC5jYXJkc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMTgyLjVweClcIjtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbn07XHJcblxyXG5DYXJkc1NsaWRlU2hvdy5pbml0KCk7XHJcbiJdfQ==
