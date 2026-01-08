(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
//--Copyright (c) 2023 Robert A. Howell
Object.defineProperty(exports, "__esModule", { value: true });
class SlideShow {
    cards;
    cardQuantShow;
    cardIndxStart = 0;
    cardCounter = 1;
    cardsIndxEnd;
    turn = 0;
    maxTurnCount;
    slideshowcontainer = document.querySelector(".slideshow");
    prevBtn;
    nextBtn;
    numberElement;
    constructor(cards, quantityShow) {
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
    numberElementText() {
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
exports.default = SlideShow;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//--Copyright (c) 2023 Robert A. Howell
const cardSlideShow_1 = require("./cardSlideShow");
const cardsSlideShow = {
    init: () => {
        let aaCards = document.querySelectorAll(".slideshow .slide");
        //Implement slideshow
        let slideShow;
        slideShow = new cardSlideShow_1.default(aaCards, 2);
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
    addSlideShowMarkup: (slideShow) => {
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
    hideOverflowElements: (slideShowWidget) => {
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

},{"./cardSlideShow":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FyZFNsaWRlU2hvdy50cyIsInNyYy9jYXJkc1NsaWRlc2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSx1Q0FBdUM7O0FBRXZDLE1BQXFCLFNBQVM7SUFDNUIsS0FBSyxDQUE2QjtJQUNsQyxhQUFhLENBQVM7SUFDdEIsYUFBYSxHQUFXLENBQUMsQ0FBQztJQUMxQixXQUFXLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFlBQVksQ0FBUztJQUNyQixJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ2pCLFlBQVksQ0FBUztJQUNyQixrQkFBa0IsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQWdCLENBQUM7SUFDdEYsT0FBTyxDQUFjO0lBQ3JCLE9BQU8sQ0FBYztJQUNyQixhQUFhLENBQWM7SUFFM0IsWUFBWSxLQUFpQyxFQUFFLFlBQW9CO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzdELENBQUM7SUFDRCwyQ0FBMkM7SUFDM0MsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkMsT0FBTztRQUNULENBQUM7UUFDRCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENB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QUFHLElBQUksQ0FBQztnQkFDOUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztnQkFDaEQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDO2dCQUNqRSxTQUFTO1lBQ1gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQztBQUVGLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vLS1Db3B5cmlnaHQgKGMpIDIwMjMgUm9iZXJ0IEEuIEhvd2VsbFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbGlkZVNob3cge1xuICBjYXJkczogTm9kZUxpc3RPZjxIVE1MRGl2RWxlbWVudD47XG4gIGNhcmRRdWFudFNob3c6IG51bWJlcjtcbiAgY2FyZEluZHhTdGFydDogbnVtYmVyID0gMDtcbiAgY2FyZENvdW50ZXI6IG51bWJlciA9IDE7XG4gIGNhcmRzSW5keEVuZDogbnVtYmVyO1xuICB0dXJuOiBudW1iZXIgPSAwO1xuICBtYXhUdXJuQ291bnQ6IG51bWJlcjtcbiAgc2xpZGVzaG93Y29udGFpbmVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVzaG93XCIpIGFzIEhUTUxFbGVtZW50O1xuICBwcmV2QnRuOiBIVE1MRWxlbWVudDtcbiAgbmV4dEJ0bjogSFRNTEVsZW1lbnQ7XG4gIG51bWJlckVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGNhcmRzOiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiwgcXVhbnRpdHlTaG93OiBudW1iZXIpIHtcbiAgICB0aGlzLmNhcmRzID0gY2FyZHM7XG4gICAgdGhpcy5jYXJkUXVhbnRTaG93ID0gcXVhbnRpdHlTaG93O1xuICAgIHRoaXMuY2FyZHNJbmR4RW5kID0gdGhpcy5jYXJkUXVhbnRTaG93IC0gMTtcbiAgICB0aGlzLm1heFR1cm5Db3VudCA9IHRoaXMuY2FyZHMubGVuZ3RoIC0gdGhpcy5jYXJkUXVhbnRTaG93O1xuICB9XG4gIC8qKkJyaW5ncyB2aXNpYmxlIHRoZSBuZXh0IHNsaWRlIGVsZW1lbnQgKi9cbiAgbmV4dCgpIHtcbiAgICBpZiAodGhpcy50dXJuID09IHRoaXMubWF4VHVybkNvdW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vSGlkZSB0aGUgZmlyc3QgZWxlbWVudCBpbiBzbGlkZXNob3dcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZEluZHhTdGFydF0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZEluZHhTdGFydF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIC8vTW92ZSB0aGUgcmlnaHQgZWxlbWVudCB0byBsZWZ0XG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRJbmR4U3RhcnQgKyAxXS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMTAwcHgpXCI7XG4gICAgLy9Nb3ZlIGluIG5ldyBlbGVtZW50XG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRzSW5keEVuZCArIDFdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgzMDBweClcIjtcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNJbmR4RW5kICsgMV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAvL0Rpc3BsYXkgdGhlIG5leHQgZWxlbWVudCBmb3Igc2xpZGVzaG93XG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRzSW5keEVuZCArIDFdLnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcblxuICAgIC8vSW5jcmVtZW50IGluZGV4IGNvdW50ZXJcbiAgICB0aGlzLmNhcmRJbmR4U3RhcnQrKztcbiAgICB0aGlzLmNhcmRzSW5keEVuZCsrO1xuICAgIHRoaXMudHVybisrO1xuICAgIHRoaXMuY2FyZENvdW50ZXIrKztcblxuICAgIHRoaXMubnVtYmVyRWxlbWVudFRleHQoKTtcbiAgfVxuICAvKipIaWRlcyBwcmV2aW91cyBzbGlkZSBlbGVtZW50ICovXG4gIHByZXZpb3VzKCkge1xuICAgIGlmICh0aGlzLnR1cm4gPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL0hpZGUgdGhlIGxhc3QgZWxlbWVudCBpbiBzbGlkZXNob3dcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZHNJbmR4RW5kXS5zdHlsZS5vcGFjaXR5ID0gXCIwJVwiO1xuICAgIHRoaXMuY2FyZHNbdGhpcy5jYXJkc0luZHhFbmRdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgIC8vTW92ZSBsZWZ0IGVsZW1lbnQgdG8gdGhlIHJpZ2h0XG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRJbmR4U3RhcnRdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgzMDBweClcIjtcblxuICAgIC8vRGlzcGxheSB0aGUgbmV4dCBlbGVtZW50IGZvciBzbGlkZXNob3dcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZEluZHhTdGFydCAtIDFdLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdGhpcy5jYXJkc1t0aGlzLmNhcmRJbmR4U3RhcnQgLSAxXS5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG5cbiAgICAvL01vdmUgaW4gbmV3IGVsZW1lbnRcbiAgICB0aGlzLmNhcmRzW3RoaXMuY2FyZEluZHhTdGFydCAtIDFdLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgxMDBweClcIjtcblxuICAgIC8vSW5jcmVtZW50IGluZGV4IGNvdW50ZXJcbiAgICB0aGlzLmNhcmRJbmR4U3RhcnQtLTtcbiAgICB0aGlzLmNhcmRzSW5keEVuZC0tO1xuICAgIHRoaXMudHVybi0tO1xuICAgIHRoaXMuY2FyZENvdW50ZXItLTtcblxuICAgIHRoaXMubnVtYmVyRWxlbWVudFRleHQoKTtcbiAgfVxuXG4gIHB1YmxpYyBudW1iZXJFbGVtZW50VGV4dCgpIHtcbiAgICAvL0NoYW5nZSB0aGUgdGV4dCB2aXNpYmxlIHdoZW4gbmV4dCBvciBwcmV2aW91cyBpcyBjbGlja2VkXG4gICAgdGhpcy5udW1iZXJFbGVtZW50LmlubmVyVGV4dCA9XG4gICAgICBcIltcIiArXG4gICAgICB0aGlzLmNhcmRDb3VudGVyLnRvU3RyaW5nKCkgK1xuICAgICAgXCIuLlwiICtcbiAgICAgICh0aGlzLmNhcmRDb3VudGVyICsgdGhpcy5jYXJkUXVhbnRTaG93IC0gMSkudG9TdHJpbmcoKSArXG4gICAgICBcIl1cIiArXG4gICAgICBcIiBvZiBcIiArXG4gICAgICB0aGlzLmNhcmRzLmxlbmd0aC50b1N0cmluZygpO1xuICB9XG59XG4iLCIvLy0tQ29weXJpZ2h0IChjKSAyMDIzIFJvYmVydCBBLiBIb3dlbGxcbmltcG9ydCBTbGlkZVNob3cgZnJvbSBcIi4vY2FyZFNsaWRlU2hvd1wiO1xuXG5jb25zdCBjYXJkc1NsaWRlU2hvdyA9IHtcbiAgaW5pdDogKCkgPT4ge1xuICAgIGxldCBhYUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXNob3cgLnNsaWRlXCIpIGFzIE5vZGVMaXN0T2Y8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgLy9JbXBsZW1lbnQgc2xpZGVzaG93XG4gICAgbGV0IHNsaWRlU2hvdzogU2xpZGVTaG93O1xuICAgIHNsaWRlU2hvdyA9IG5ldyBTbGlkZVNob3coYWFDYXJkcywgMik7XG5cbiAgICAvL0J1aWxkIHRoZSBtYXJrdXAgbmVlZGVkIGZvciB0aGUgc2xpZGVzaG93XG4gICAgY2FyZHNTbGlkZVNob3cuYWRkU2xpZGVTaG93TWFya3VwKHNsaWRlU2hvdyk7XG5cbiAgICAvL0hpZGUgb3ZlcmZsb3cgZWxlbWVudHNcbiAgICBjYXJkc1NsaWRlU2hvdy5oaWRlT3ZlcmZsb3dFbGVtZW50cyhzbGlkZVNob3cpO1xuXG4gICAgLy9OZXh0K3ByZXZpb3VzIGJ1dHRvbiBldmVudCBsaXN0ZW5lcnNcbiAgICBzbGlkZVNob3cubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzbGlkZVNob3cubmV4dCgpO1xuICAgIH0pO1xuICAgIHNsaWRlU2hvdy5wcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNsaWRlU2hvdy5wcmV2aW91cygpO1xuICAgIH0pO1xuICB9LFxuICBhZGRTbGlkZVNob3dNYXJrdXA6IChzbGlkZVNob3c6IFNsaWRlU2hvdykgPT4ge1xuICAgIC8vQWRkIHRoZSBjYXJkcyB0byBhIG5ldyBjb250YWluZXJcbiAgICBsZXQgc2xpZGVzID0gc2xpZGVTaG93LnNsaWRlc2hvd2NvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICBmb3IgKGxldCBjYXJkIG9mIHNsaWRlU2hvdy5jYXJkcykge1xuICAgICAgbGV0IHRlbXAgPSBjYXJkO1xuICAgICAgc2xpZGVzLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWVuZFwiLCB0ZW1wKTtcbiAgICB9XG4gICAgLy9TdHlsZSB0aGUgY29udGFpbmVyIHdpdGggZmxleGJveFxuICAgIHNsaWRlcy5jbGFzc0xpc3QuYWRkKFwic2xpZGVzY29udGFpbmVyXCIpO1xuICAgIHNsaWRlcy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgIHNsaWRlcy5zdHlsZS5oZWlnaHQgPSBcIjEwZW1cIjtcbiAgICBzbGlkZXMuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHNsaWRlcy5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICBzbGlkZVNob3cuc2xpZGVzaG93Y29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcblxuICAgIC8vQWRkIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnNcbiAgICBsZXQgc2xpZGVTaG93QnRucyA9IHNsaWRlU2hvdy5zbGlkZXNob3djb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG5cbiAgICAvL0xlZnQgc2xpZGVzaG93IGJ0blxuICAgIGxldCBwcmV2aW91c1NsaWRlU2hvd0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgcHJldmlvdXNTbGlkZVNob3dCdG4uY2xhc3NMaXN0LmFkZChcInNsaWRlc2hvd1ByZXZcIik7XG4gICAgcHJldmlvdXNTbGlkZVNob3dCdG4uaW5uZXJUZXh0ID0gXCLina5cIjtcbiAgICBzbGlkZVNob3dCdG5zLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWVuZFwiLCBwcmV2aW91c1NsaWRlU2hvd0J0bik7XG5cbiAgICAvL1VwZGF0ZSBzbGlkZXNob3cgb2JqZWN0XG4gICAgc2xpZGVTaG93LnByZXZCdG4gPSBwcmV2aW91c1NsaWRlU2hvd0J0bjtcblxuICAgIC8vTnVtYmVyIGVsZW1lbnQ6IHVzZWQgdG8gc2hvdyB3aGF0IHNsaWRlcyBhcmUgcmV2ZWFsZWRcbiAgICBzbGlkZVNob3cubnVtYmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICBzbGlkZVNob3cubnVtYmVyRWxlbWVudFRleHQoKTtcbiAgICBwcmV2aW91c1NsaWRlU2hvd0J0bi5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBzbGlkZVNob3cubnVtYmVyRWxlbWVudCk7XG4gICAgLy9OdW1iZXIgZWxlbWVudCBzdHlsZXNcbiAgICBzbGlkZVNob3cubnVtYmVyRWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICBzbGlkZVNob3cubnVtYmVyRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gICAgc2xpZGVTaG93Lm51bWJlckVsZW1lbnQuc3R5bGUuYWxpZ25Db250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICBzbGlkZVNob3cubnVtYmVyRWxlbWVudC5zdHlsZS5tYXJnaW5JbmxpbmUgPSBcIjEuNXJlbVwiO1xuXG4gICAgLy9SaWdodCBzbGlkZXNob3cgYnRuXG4gICAgbGV0IG5leHRTbGlkZVNob3dCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIG5leHRTbGlkZVNob3dCdG4uY2xhc3NMaXN0LmFkZChcInNsaWRlc2hvd05leHRcIik7XG4gICAgbmV4dFNsaWRlU2hvd0J0bi5pbm5lclRleHQgPSBcIuKdr1wiO1xuICAgIHNsaWRlU2hvd0J0bnMuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIG5leHRTbGlkZVNob3dCdG4pO1xuICAgIHNsaWRlU2hvd0J0bnMuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHNsaWRlU2hvd0J0bnMuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgIC8vVXBkYXRlIHNsaWRlc2hvdyBvYmplY3RcbiAgICBzbGlkZVNob3cubmV4dEJ0biA9IG5leHRTbGlkZVNob3dCdG47XG4gIH0sXG5cbiAgaGlkZU92ZXJmbG93RWxlbWVudHM6IChzbGlkZVNob3dXaWRnZXQ6IFNsaWRlU2hvdykgPT4ge1xuICAgIGlmIChzbGlkZVNob3dXaWRnZXQuY2FyZEluZHhTdGFydCA8IHNsaWRlU2hvd1dpZGdldC5jYXJkUXVhbnRTaG93KSB7XG4gICAgICBmb3IgKGxldCBpID0gc2xpZGVTaG93V2lkZ2V0LmNhcmRzLmxlbmd0aCAtIDE7IGkgPiBzbGlkZVNob3dXaWRnZXQuY2FyZHNJbmR4RW5kOyBpLS0pIHtcbiAgICAgICAgc2xpZGVTaG93V2lkZ2V0LmNhcmRzW2ldLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBzbGlkZVNob3dXaWRnZXQuY2FyZHNbaV0uc3R5bGUub3BhY2l0eSA9IFwiMCVcIjtcbiAgICAgICAgc2xpZGVTaG93V2lkZ2V0LmNhcmRzW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgc2xpZGVTaG93V2lkZ2V0LmNhcmRzW2ldLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgxODIuNXB4KVwiO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59O1xuXG5jYXJkc1NsaWRlU2hvdy5pbml0KCk7XG4iXX0=
