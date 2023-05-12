(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionarySearch = void 0;
//--Copyright (c) Robert A. Howell
const api_1 = require("./api");
const DictionarySearchWidget_1 = require("./DictionarySearchWidget");
class DictionarySearch extends DictionarySearchWidget_1.default {
    static wordStorage;
    static requestUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    previousWordsBtnIsCreated = false;
    previousWordsBtnWasClicked = false;
    previousWordsNotFoundOnce = false;
    wordURL;
    wordData;
    dictionarySearchMarkup;
    constructor(elem) {
        super();
        this.dictionarySearchMarkup = this.createDictionaryWidgetMarkup(elem);
        this.addWidgetEvents();
        DictionarySearch.getLocalStorageWordCaches();
        //new dictionary. no initializing functions needed
        //static class - needs to show on browser any caches that exist
        //and their names
    }
    static getLocalStorageWordCaches() {
        //enumerate all of the caches
        //cache response links and cache name are previously stored in local storage
        //Enumerate local storage 'word-caches' items
        let storageStr = localStorage.getItem('word-caches');
        if (storageStr != null) {
            DictionarySearch.wordStorage = JSON.parse(storageStr);
            return DictionarySearch.wordStorage;
        }
    }
    getWordURL() {
        return this.wordURL;
    }
    getWordData() {
        return this.wordData;
    }
    addWidgetEvents() {
        if (this.dictionarySearchMarkup == undefined) {
            console.log("A search element is undefined from searchWord | wordSearch");
            return;
        }
        //Add form input event listeners
        //Upon input entry, fire API fetch
        this.dictionarySearchMarkup.wordSearch.addEventListener("click", (event) => {
            event.preventDefault();
            this.wordSearch(this.dictionarySearchMarkup, false, null);
        });
        this.dictionarySearchMarkup.searchWord.addEventListener("keypress", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.wordSearch(this.dictionarySearchMarkup, false, null);
            }
        });
        // "Previous word searches" button fetches locally stored words
        // Clicking the button displays each word in a list within the widget
        this.dictionarySearchMarkup.previousWordBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const placementlocationholder = document.querySelector(".previousWords");
            let buttonContainer = document.getElementById("dictionary-btns");
            let newButtonContainer;
            if (this.previousWordsBtnWasClicked == false) {
                if (this.previousWordsBtnIsCreated == false) {
                    newButtonContainer = placementlocationholder.insertAdjacentElement('afterend', document.createElement("div"));
                    newButtonContainer.id = "dictionary-btns";
                    //Check the placement location and word caches for undefined
                    if (placementlocationholder != undefined && DictionarySearch.wordStorage !== undefined) {
                        for (let wordCache of DictionarySearch.wordStorage) {
                            const cacheWordHeadingElem = newButtonContainer.appendChild(document.createElement("button"));
                            cacheWordHeadingElem.setAttribute("type", "button");
                            cacheWordHeadingElem.classList.add("dictionary-btn", "dictionary-word-btn");
                            cacheWordHeadingElem.textContent = wordCache.word;
                            //add event listener for new button
                            cacheWordHeadingElem.addEventListener("click", (event) => {
                                event.preventDefault();
                                this.wordSearch(this.dictionarySearchMarkup, true, wordCache);
                            });
                            this.previousWordsBtnIsCreated = true;
                        }
                    }
                    else {
                        if (this.previousWordsNotFoundOnce == false) {
                            const noWordsHeadingElem = newButtonContainer.appendChild(document.createElement("div"));
                            noWordsHeadingElem.classList.add("dictionary-btn", "error-notfound");
                            noWordsHeadingElem.textContent = "Previous words not found. The cache is empty.";
                            this.previousWordsNotFoundOnce = true;
                            this.previousWordsBtnWasClicked = true;
                        }
                        else {
                            buttonContainer.style.display = "block";
                            this.previousWordsBtnWasClicked = true;
                            return;
                        }
                    }
                }
                else {
                    buttonContainer.style.display = "block";
                    this.previousWordsBtnWasClicked = true;
                    return;
                }
            }
            else {
                buttonContainer.style.display = "none";
                this.previousWordsBtnWasClicked = false;
                return;
            }
        });
        this.dictionarySearchMarkup.refreshBtn.addEventListener("click", (event) => {
            event.preventDefault();
            location.reload();
        });
    }
    addDictionaryTermtoLocalStorage(sendToBrowserCache, localstoragevalue) {
        let wordStore = [];
        wordStore.push(localstoragevalue);
        // Add the cache item to Local Storage
        try {
            if (localStorage.getItem('word-caches') == null) {
                // Local storage empty => add the word
                localStorage.setItem('word-caches', JSON.stringify(wordStore));
                return;
            }
            // Add word to current 'word-caches' in local storage
            let storageStr = localStorage.getItem('word-caches');
            if (storageStr == null) {
                try {
                    throw new Error("'word-caches' values are null. Try clearing browser cache.");
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.log(error.name);
                        console.log(error.message);
                        console.log(error.stack);
                    }
                }
            }
            else {
                let allcache = JSON.parse(storageStr);
                for (let cache of allcache) {
                    if (cache.wordURL == localstoragevalue.wordURL) {
                        // Word is already in local storage
                        // No need to add it to the array
                        return;
                    }
                }
                // Add word to existing 'word-caches' in local storage
                allcache.push(localstoragevalue);
                localStorage.setItem('word-caches', JSON.stringify(allcache));
            }
        }
        catch (err) {
            console.log("Problem storing key-value. Error: ", err);
        }
    }
    fetchDictionaryTerm(word, wordUrl, elems, sendToCache, cacheName) {
        //TODO: dictionary cache management:
        //TODO: 1.) is to be cached true? --check
        //TODO: 2.) is to be cached false? --check
        //TODO: --> are they the same behavior? --check
        //TODO: --> is the result in the cache? --check
        //TODO: implement a send to cache option
        //
        //
        // The function calls to either store in Cache Storage
        // If items are to be cached, edit Local Storage cache names
        let wordcache = {
            inCache: sendToCache,
            word: word,
            wordURL: wordUrl,
            cacheName: sendToCache ? cacheName : "",
        };
        const wordFetchRequest = async () => {
            //set apiGET::sendToBrowserCache to true to use cache storage
            const wordFetch = new api_1.apiGET(wordcache.wordURL, false, wordcache.cacheName, elems.errorElem);
            let noDefinitions = false;
            //fetch request
            let data = await wordFetch.apiGET(wordFetch.getGETURL());
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            let wordData = data;
            //check if the returned object is valid word data definitions
            if (typeof data == 'object') {
                if (Object.hasOwn(wordData, 'title')) {
                    // no definitions were found
                    noDefinitions = true;
                }
            }
            if (data != undefined && !noDefinitions) { // good fetch--> move forward to markup render
                this.addDictionaryTermtoLocalStorage(wordFetch.getSendToBrowserCache(), wordcache);
                return data;
            }
            else {
                if (navigator.onLine !== false) { // check network status via navigator object
                    if (noDefinitions) {
                        if (wordData.title == "No Definitions Found")
                            elems.searchWord.classList.add("invalid-notfound");
                        elems.errorElem.classList.add("error-notfound");
                        elems.errorElem.innerText = "No Definitions Found";
                    }
                    else {
                        elems.searchWord.classList.add("invalid-notfound");
                        elems.errorElem.classList.add("error-notfound");
                        elems.errorElem.innerText = "Invalid word!";
                    }
                }
                else {
                    elems.errorElem.innerText += ", check network connection.";
                }
            }
        };
        let wordData = wordFetchRequest();
        return wordData;
    }
    wordValidation(intxt) {
        let trimmed = intxt.trim();
        let lettersRE = new RegExp("^[A-Za-z]{1,45}$");
        if (lettersRE.test(trimmed)) {
            return true;
        }
        else {
            //word is not an acceptable word.`);
            return false;
        }
    }
    callFetchDictionaryTerm(searchElems, word, wordURL) {
        // When the word data resolves, call markup functions
        let wordDataPromise = new Promise((resolve) => {
            resolve(this.fetchDictionaryTerm(word, wordURL, searchElems, false, null));
        });
        wordDataPromise.then((data) => {
            this.wordData = data;
            this.createDictionaryTermWithMarkup(data, searchElems);
        });
        // Remove unneeded classes if applied previously
        searchElems.searchWord.classList.remove("invalid");
        searchElems.searchWord.classList.remove("invalid-notfound");
        searchElems.errorElem.classList.remove("error");
        searchElems.errorElem.classList.remove("error-notfound");
        searchElems.errorElem.textContent = "";
    }
    wordSearch(searchElems, isFromPreviousWords, cachedWord) {
        if (isFromPreviousWords) {
            this.callFetchDictionaryTerm(searchElems, cachedWord.word, cachedWord.wordURL);
        }
        else {
            // Take user input and filter to an accepted string
            let acceptedInputWord = false;
            this.wordValidation(searchElems.searchWord.value)
                ? acceptedInputWord = true : acceptedInputWord = false;
            if (acceptedInputWord) {
                // Create a URL of the accepted word for use in the fetch call
                this.wordURL = new URL(searchElems.searchWord.value.toString(), DictionarySearch.requestUrl);
                this.callFetchDictionaryTerm(searchElems, searchElems.searchWord.value, this.wordURL);
            }
            else {
                searchElems.searchWord.classList.remove("invalid-notfound");
                searchElems.searchWord.classList.add("invalid");
                searchElems.errorElem.classList.remove("error-notfound");
                searchElems.errorElem.classList.add("error");
                searchElems.errorElem.textContent = "Invalid word!";
            }
        }
        searchElems.searchWord.value = ''; // reset input string
    }
}
exports.DictionarySearch = DictionarySearch;

},{"./DictionarySearchWidget":2,"./api":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DictionarySearchWidget {
    createDictionaryWidgetMarkup(elem) {
        //insert the widget after the passed in "elem"
        if (elem !== undefined) {
            if (elem.classList.contains("dictionaryWidget")) {
                const dictionary = elem.insertAdjacentElement("afterend", document.createElement("section"));
                if (dictionary != null) {
                    // Create widget elements
                    const artH = dictionary.appendChild(document.createElement("h3"));
                    const searchForm = dictionary.appendChild(document.createElement("form"));
                    const previousWords = dictionary.appendChild(document.createElement("div"));
                    // Return the elements used in later functions
                    let searchElements = {
                        searchWord: searchForm.appendChild(document.createElement("input")),
                        wordSearch: searchForm.appendChild(document.createElement("button")),
                        dictionaryElem: dictionary,
                        errorElem: searchForm.appendChild(document.createElement("span")),
                        previousWordBtn: previousWords.appendChild(document.createElement("button")),
                        refreshBtn: previousWords.appendChild(document.createElement("button")),
                    };
                    // Add attributes and property values
                    previousWords.classList.add("previousWords");
                    searchElements.searchWord.classList.add("monospace");
                    searchElements.previousWordBtn.classList.add("dictionary-btn");
                    searchElements.refreshBtn.classList.add("dictionary-btn");
                    searchElements.searchWord.setAttribute('type', 'text');
                    searchElements.searchWord.setAttribute('placeholder', 'Search...');
                    searchElements.searchWord.setAttribute("aria-label", "Input");
                    searchElements.wordSearch.setAttribute('type', 'button');
                    searchElements.wordSearch.setAttribute("aria-label", "Search");
                    searchElements.wordSearch.innerText = "Fetch";
                    dictionary.id = "dictionary";
                    artH.textContent = "Dictionary Term:";
                    searchForm.id = "dictionary-search";
                    searchForm.action = "index.html";
                    searchElements.searchWord.id = "search-word";
                    searchElements.wordSearch.id = "word-search";
                    searchElements.previousWordBtn.innerText = "Previous Word Searches";
                    searchElements.refreshBtn.innerText = "Refresh";
                    return searchElements;
                }
                else {
                    console.log("The determined dictionary element is null.");
                }
            }
            else {
                console.log(`Add "dictionaryWidget" class to ${elem.nodeName} node.`);
            }
        }
        else {
            console.log(`There is no "dictionaryWidget" class on this page.`);
        }
    }
    createDictionaryTermWithMarkup(wordData, searchElems) {
        if (wordData == null || !(wordData instanceof Object)) {
            try {
                throw new Error("The data is null or an incorrect type");
            }
            catch (error) {
                console.log(error.message);
            }
            return;
        }
        // Add the word's definition to the dictionary widget
        const definitionDescriptionContainer = searchElems.dictionaryElem.appendChild(document.createElement("div"));
        const definitionDescription = definitionDescriptionContainer.appendChild(document.createElement("div"));
        definitionDescription.appendChild(document.createElement("hr")); // word definition separator
        definitionDescriptionContainer.classList.add("definitionDescription");
        // The word data represents complex JSON object
        // Recurse the word data object, adding elements from the various levels
        wordData.map((word) => {
            //console.log("The word is: ",word)
            const wordTitle = definitionDescription.appendChild(document.createElement("h3"));
            wordTitle.textContent = word.word;
            //Add the word and examples to page
            word.meanings.map((wordType) => {
                //console.log("WordType are: ", wordType)
                const wordTypeH = definitionDescription.appendChild(document.createElement("h4"));
                const wordTypeList = definitionDescription.appendChild(document.createElement("ul"));
                wordTypeH.textContent = wordType.partOfSpeech;
                wordType.definitions.map((def) => {
                    //console.log("Definition is: ", def);
                    let wordTypeDefItem = wordTypeList.appendChild(document.createElement("li"));
                    let definitionP = wordTypeDefItem.appendChild(document.createElement("p"));
                    definitionP.textContent = def.definition;
                    definitionP.classList.add("wordDefinition");
                    const addAdjacentElem = () => {
                        //console.log("Definitions is: ", def);
                        const newP = definitionP.insertAdjacentElement('beforeend', document.createElement("p"));
                        if (newP instanceof HTMLElement) {
                            const newPi = newP.appendChild(document.createElement("i"));
                            newPi.textContent = def.example;
                        }
                        definitionP.classList.add("example");
                    };
                    //check if key "example" is in definition. If it is, add the example to list
                    "example" in def ? addAdjacentElem() : true == true;
                });
            });
        });
        definitionDescriptionContainer.appendChild(definitionDescription);
    }
}
exports.default = DictionarySearchWidget;

},{}],3:[function(require,module,exports){
"use strict";
//--Copyright (c) Robert A. Howell  May, 2023
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGET = void 0;
class apiGET {
    GETURL;
    sendToBrowserCache = false;
    browserCacheName;
    errorElem;
    constructor(GETURL, sendToBrowserCache, browserCacheName, errorElem) {
        this.GETURL = GETURL;
        this.sendToBrowserCache = sendToBrowserCache;
        this.browserCacheName = browserCacheName;
        this.errorElem = errorElem;
    }
    getSendToBrowserCache() {
        return this.sendToBrowserCache;
    }
    getGETURL() {
        return this.GETURL;
    }
    ;
    setSendToBrowserCache() {
        return this.sendToBrowserCache ? false : true;
    }
    setGETURL(GETURL) {
        if (typeof GETURL === 'string') {
            this.GETURL = new URL(GETURL);
        }
        else {
            this.GETURL = GETURL;
        }
    }
    apiResponseErrorCheck(res) {
        if (res.status == 404) {
            this.errorElem.classList.add("error");
            this.errorElem.innerText = "404 fetch error!";
            return res;
        }
        if (!res.ok || res.status != 200) {
            throw new Error(res.ok + ": " + res.status);
        }
        return res.json();
    }
    fetchData(GETURL) {
        return fetch(GETURL)
            .then((response) => this.apiResponseErrorCheck(response))
            .then((data) => {
            if (data instanceof Response) {
                return data.text();
            }
            else
                return data;
        })
            .catch((e) => {
            console.log(e);
            this.errorElem.classList.add("error");
            this.errorElem.innerText = `${e.message}`;
        });
    }
    async apiGET(GETURL) {
        if (this.sendToBrowserCache) {
            let dataCachePromise = new Promise((resolve, reject) => {
                if ('caches' in window) {
                    // Open cache and check for request existing in Cache Storage
                    window.caches.open(this.browserCacheName).then((cache) => {
                        caches.match(GETURL).then((result) => {
                            if (result === undefined) {
                                // Fetch the request normally
                                fetch(GETURL).then((result) => {
                                    // Make a copy of the response since it can only be read once
                                    let clonedresp = result.clone();
                                    // Add the result to the cache
                                    cache.put(GETURL, result);
                                    console.log("Word cached to cache storage.");
                                    resolve(clonedresp.json().then((text) => text));
                                });
                            }
                            else {
                                console.log("Word search response retrieved from cache storage.");
                                resolve(result.json().then((text) => text));
                            }
                        });
                    });
                }
            });
            dataCachePromise.then((response) => {
                return response;
            });
            return dataCachePromise;
        }
        else {
            let dataPromise = new Promise((resolve, reject) => {
                resolve(this.fetchData(GETURL));
            });
            dataPromise.then((data) => {
                return data;
            });
            console.log("Word search response retrieved via fetch.");
            return dataPromise;
        }
    }
}
exports.apiGET = apiGET;

},{}],4:[function(require,module,exports){
"use strict";
//--Copyright (c) Robert A. Howell  May, 2023
Object.defineProperty(exports, "__esModule", { value: true });
const DictionarySearch_1 = require("./DictionarySearch");
const dictionaryWidget = {
    init: () => {
        const elem = document.querySelector('.dictionaryWidget');
        // Create the dictionary widget, call create
        new DictionarySearch_1.DictionarySearch(elem);
    }
};
dictionaryWidget.init();

},{"./DictionarySearch":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvRGljdGlvbmFyeVNlYXJjaC50cyIsInNyYy9EaWN0aW9uYXJ5U2VhcmNoV2lkZ2V0LnRzIiwic3JjL2FwaS50cyIsInNyYy9kaWN0aW9uYXJ5d2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUEsa0NBQWtDO0FBQ2xDLCtCQUErQjtBQUUvQixxRUFBNkQ7QUFFN0QsTUFBYSxnQkFBaUIsU0FBUSxnQ0FBc0I7SUFDakQsTUFBTSxDQUFDLFdBQVcsQ0FBMEI7SUFDM0MsTUFBTSxDQUFDLFVBQVUsR0FBVyxrREFBa0QsQ0FBQztJQUMvRSx5QkFBeUIsR0FBWSxLQUFLLENBQUM7SUFDM0MsMEJBQTBCLEdBQVksS0FBSyxDQUFDO0lBQzVDLHlCQUF5QixHQUFZLEtBQUssQ0FBQztJQUMzQyxPQUFPLENBQU07SUFDYixRQUFRLENBQVM7SUFDakIsc0JBQXNCLENBQTJCO0lBRXpELFlBQVksSUFBYTtRQUNyQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFFLENBQUM7UUFDdkUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLGdCQUFnQixDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDN0Msa0RBQWtEO1FBQ2xELCtEQUErRDtRQUMvRCxpQkFBaUI7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBQyx5QkFBeUI7UUFDbkMsNkJBQTZCO1FBQzdCLDRFQUE0RTtRQUU1RSw2Q0FBNkM7UUFDN0MsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyRCxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDcEIsZ0JBQWdCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEQsT0FBTyxn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QUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7Z0JBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDbkMsQ0FBQyxDQUFDLENBQUE7WUFDRixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO1lBQ3hELE9BQU8sV0FBVyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztDQUNKO0FBMUdELHdCQTBHQzs7OztBQzVHRCw2Q0FBNkM7O0FBRTdDLHlEQUFxRDtBQUdyRCxNQUFNLGdCQUFnQixHQUFHO0lBQ3JCLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDUCxNQUFNLElBQUksR0FBSSxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFhLENBQUM7UUFFdEUsNENBQTRDO1FBQzVDLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKLENBQUM7QUFFRixnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vLS1Db3B5cmlnaHQgKGMpIFJvYmVydCBBLiBIb3dlbGxcbmltcG9ydCB7IGFwaUdFVCB9IGZyb20gXCIuL2FwaVwiO1xuaW1wb3J0IHsgRGljdGlvbmFyeVNlYXJjaEVsZW1lbnRzLCBsb2NhbHN0b3JhZ2V3b3JkdmFsdWUgfSBmcm9tICcuL3dpZGdldGludGVyZmFjZSdcbmltcG9ydCBEaWN0aW9uYXJ5U2VhcmNoV2lkZ2V0IGZyb20gXCIuL0RpY3Rpb25hcnlTZWFyY2hXaWRnZXRcIlxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeVNlYXJjaCBleHRlbmRzIERpY3Rpb25hcnlTZWFyY2hXaWRnZXQge1xuICAgIHB1YmxpYyBzdGF0aWMgd29yZFN0b3JhZ2U6IGxvY2Fsc3RvcmFnZXdvcmR2YWx1ZVtdO1xuICAgIHByaXZhdGUgc3RhdGljIHJlcXVlc3RVcmw6IHN0cmluZyA9IFwiaHR0cHM6Ly9hcGkuZGljdGlvbmFyeWFwaS5kZXYvYXBpL3YyL2VudHJpZXMvZW4vXCI7XG4gICAgcHJpdmF0ZSBwcmV2aW91c1dvcmRzQnRuSXNDcmVhdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBwcmV2aW91c1dvcmRzQnRuV2FzQ2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgcHJldmlvdXNXb3Jkc05vdEZvdW5kT25jZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgd29yZFVSTDogVVJMO1xuICAgIHByaXZhdGUgd29yZERhdGE6IG9iamVjdDtcbiAgICBwcml2YXRlIGRpY3Rpb25hcnlTZWFyY2hNYXJrdXA6IERpY3Rpb25hcnlTZWFyY2hFbGVtZW50cztcblxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5U2VhcmNoTWFya3VwID0gdGhpcy5jcmVhdGVEaWN0aW9uYXJ5V2lkZ2V0TWFya3VwKGVsZW0pITtcbiAgICAgICAgdGhpcy5hZGRXaWRnZXRFdmVudHMoKTtcbiAgICAgICAgRGljdGlvbmFyeVNlYXJjaC5nZXRMb2NhbFN0b3JhZ2VXb3JkQ2FjaGVzKCk7XG4gICAgICAgIC8vbmV3IGRpY3Rpb25hcnkuIG5vIGluaXRpYWxpemluZyBmdW5jdGlvbnMgbmVlZGVkXG4gICAgICAgIC8vc3RhdGljIGNsYXNzIC0gbmVlZHMgdG8gc2hvdyBvbiBicm93c2VyIGFueSBjYWNoZXMgdGhhdCBleGlzdFxuICAgICAgICAvL2FuZCB0aGVpciBuYW1lc1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TG9jYWxTdG9yYWdlV29yZENhY2hlcygpIHtcbiAgICAgICAgLy9lbnVtZXJhdGUgYWxsIG9mIHRoZSBjYWNoZXNcbiAgICAgICAgLy9jYWNoZSByZXNwb25zZSBsaW5rcyBhbmQgY2FjaGUgbmFtZSBhcmUgcHJldmlvdXNseSBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZVxuXG4gICAgICAgIC8vRW51bWVyYXRlIGxvY2FsIHN0b3JhZ2UgJ3dvcmQtY2FjaGVzJyBpdGVtc1xuICAgICAgICBsZXQgc3RvcmFnZVN0ciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3b3JkLWNhY2hlcycpO1xuICAgICAgICBpZiAoc3RvcmFnZVN0ciAhPSBudWxsKSB7XG4gICAgICAgICAgICBEaWN0aW9uYXJ5U2VhcmNoLndvcmRTdG9yYWdlID0gSlNPTi5wYXJzZShzdG9yYWdlU3RyKTtcbiAgICAgICAgICAgIHJldHVybiBEaWN0aW9uYXJ5U2VhcmNoLndvcmRTdG9yYWdlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFdvcmRVUkwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndvcmRVUkw7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFdvcmREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53b3JkRGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFdpZGdldEV2ZW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMuZGljdGlvbmFyeVNlYXJjaE1hcmt1cCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQSBzZWFyY2ggZWxlbWVudCBpcyB1bmRlZmluZWQgZnJvbSBzZWFyY2hXb3JkIHwgd29yZFNlYXJjaFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL0FkZCBmb3JtIGlucHV0IGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAvL1Vwb24gaW5wdXQgZW50cnksIGZpcmUgQVBJIGZldGNoXG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVNlYXJjaE1hcmt1cC53b3JkU2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLndvcmRTZWFyY2godGhpcy5kaWN0aW9uYXJ5U2VhcmNoTWFya3VwLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVNlYXJjaE1hcmt1cC5zZWFyY2hXb3JkLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMud29yZFNlYXJjaCh0aGlzLmRpY3Rpb25hcnlTZWFyY2hNYXJrdXAsIGZhbHNlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gXCJQcmV2aW91cyB3b3JkIHNlYXJjaGVzXCIgYnV0dG9uIGZldGNoZXMgbG9jYWxseSBzdG9yZWQgd29yZHNcbiAgICAgICAgLy8gQ2xpY2tpbmcgdGhlIGJ1dHRvbiBkaXNwbGF5cyBlYWNoIHdvcmQgaW4gYSBsaXN0IHdpdGhpbiB0aGUgd2lkZ2V0XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVNlYXJjaE1hcmt1cC5wcmV2aW91c1dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlbWVudGxvY2F0aW9uaG9sZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcmV2aW91c1dvcmRzXCIpITtcbiAgICAgICAgICAgIGxldCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpY3Rpb25hcnktYnRuc1wiKSE7XG4gICAgICAgICAgICBsZXQgbmV3QnV0dG9uQ29udGFpbmVyOiBFbGVtZW50O1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldmlvdXNXb3Jkc0J0bldhc0NsaWNrZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmV2aW91c1dvcmRzQnRuSXNDcmVhdGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0J1dHRvbkNvbnRhaW5lciA9IHBsYWNlbWVudGxvY2F0aW9uaG9sZGVyLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSE7XG4gICAgICAgICAgICAgICAgICAgIG5ld0J1dHRvbkNvbnRhaW5lci5pZCA9IFwiZGljdGlvbmFyeS1idG5zXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgdGhlIHBsYWNlbWVudCBsb2NhdGlvbiBhbmQgd29yZCBjYWNoZXMgZm9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBpZiAocGxhY2VtZW50bG9jYXRpb25ob2xkZXIgIT0gdW5kZWZpbmVkICYmIERpY3Rpb25hcnlTZWFyY2gud29yZFN0b3JhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgd29yZENhY2hlIG9mIERpY3Rpb25hcnlTZWFyY2gud29yZFN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZVdvcmRIZWFkaW5nRWxlbSA9IG5ld0J1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVdvcmRIZWFkaW5nRWxlbS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlV29yZEhlYWRpbmdFbGVtLmNsYXNzTGlzdC5hZGQoXCJkaWN0aW9uYXJ5LWJ0blwiLCBcImRpY3Rpb25hcnktd29yZC1idG5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVXb3JkSGVhZGluZ0VsZW0udGV4dENvbnRlbnQgPSB3b3JkQ2FjaGUud29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FkZCBldmVudCBsaXN0ZW5lciBmb3IgbmV3IGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlV29yZEhlYWRpbmdFbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JkU2VhcmNoKHRoaXMuZGljdGlvbmFyeVNlYXJjaE1hcmt1cCwgdHJ1ZSwgd29yZENhY2hlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXb3Jkc0J0bklzQ3JlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmV2aW91c1dvcmRzTm90Rm91bmRPbmNlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9Xb3Jkc0hlYWRpbmdFbGVtID0gbmV3QnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vV29yZHNIZWFkaW5nRWxlbS5jbGFzc0xpc3QuYWRkKFwiZGljdGlvbmFyeS1idG5cIiwgXCJlcnJvci1ub3Rmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1dvcmRzSGVhZGluZ0VsZW0udGV4dENvbnRlbnQgPSBcIlByZXZpb3VzIHdvcmRzIG5vdCBmb3VuZC4gVGhlIGNhY2hlIGlzIGVtcHR5LlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXb3Jkc05vdEZvdW5kT25jZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1dvcmRzQnRuV2FzQ2xpY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzV29yZHNCdG5XYXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzV29yZHNCdG5XYXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1dvcmRzQnRuV2FzQ2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5U2VhcmNoTWFya3VwLnJlZnJlc2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRGljdGlvbmFyeVRlcm10b0xvY2FsU3RvcmFnZShzZW5kVG9Ccm93c2VyQ2FjaGU6IGJvb2xlYW4sIGxvY2Fsc3RvcmFnZXZhbHVlOiBsb2NhbHN0b3JhZ2V3b3JkdmFsdWUpIHtcbiAgICAgICAgbGV0IHdvcmRTdG9yZTogYW55ID0gW107XG4gICAgICAgIHdvcmRTdG9yZS5wdXNoKGxvY2Fsc3RvcmFnZXZhbHVlKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNhY2hlIGl0ZW0gdG8gTG9jYWwgU3RvcmFnZVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3b3JkLWNhY2hlcycpID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBMb2NhbCBzdG9yYWdlIGVtcHR5ID0+IGFkZCB0aGUgd29yZFxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3b3JkLWNhY2hlcycsIEpTT04uc3RyaW5naWZ5KHdvcmRTdG9yZSkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCB3b3JkIHRvIGN1cnJlbnQgJ3dvcmQtY2FjaGVzJyBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBsZXQgc3RvcmFnZVN0ciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3b3JkLWNhY2hlcycpO1xuICAgICAgICAgICAgaWYgKHN0b3JhZ2VTdHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIid3b3JkLWNhY2hlcycgdmFsdWVzIGFyZSBudWxsLiBUcnkgY2xlYXJpbmcgYnJvd3NlciBjYWNoZS5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhbGxjYWNoZTogbG9jYWxzdG9yYWdld29yZHZhbHVlW10gPSBKU09OLnBhcnNlKHN0b3JhZ2VTdHIpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNhY2hlIG9mIGFsbGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS53b3JkVVJMID09IGxvY2Fsc3RvcmFnZXZhbHVlLndvcmRVUkwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdvcmQgaXMgYWxyZWFkeSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBuZWVkIHRvIGFkZCBpdCB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBZGQgd29yZCB0byBleGlzdGluZyAnd29yZC1jYWNoZXMnIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICBhbGxjYWNoZS5wdXNoKGxvY2Fsc3RvcmFnZXZhbHVlKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd29yZC1jYWNoZXMnLCBKU09OLnN0cmluZ2lmeShhbGxjYWNoZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvYmxlbSBzdG9yaW5nIGtleS12YWx1ZS4gRXJyb3I6IFwiLCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaERpY3Rpb25hcnlUZXJtKHdvcmQ6IHN0cmluZywgd29yZFVybDogVVJMLCBlbGVtczogRGljdGlvbmFyeVNlYXJjaEVsZW1lbnRzLFxuICAgICAgICBzZW5kVG9DYWNoZTogYm9vbGVhbiwgY2FjaGVOYW1lOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgICAgIC8vVE9ETzogZGljdGlvbmFyeSBjYWNoZSBtYW5hZ2VtZW50OlxuICAgICAgICAvL1RPRE86IDEuKSBpcyB0byBiZSBjYWNoZWQgdHJ1ZT8gLS1jaGVja1xuICAgICAgICAvL1RPRE86IDIuKSBpcyB0byBiZSBjYWNoZWQgZmFsc2U/IC0tY2hlY2tcbiAgICAgICAgLy9UT0RPOiAtLT4gYXJlIHRoZXkgdGhlIHNhbWUgYmVoYXZpb3I/IC0tY2hlY2tcbiAgICAgICAgLy9UT0RPOiAtLT4gaXMgdGhlIHJlc3VsdCBpbiB0aGUgY2FjaGU/IC0tY2hlY2tcbiAgICAgICAgLy9UT0RPOiBpbXBsZW1lbnQgYSBzZW5kIHRvIGNhY2hlIG9wdGlvblxuICAgICAgICAvL1xuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gY2FsbHMgdG8gZWl0aGVyIHN0b3JlIGluIENhY2hlIFN0b3JhZ2VcbiAgICAgICAgLy8gSWYgaXRlbXMgYXJlIHRvIGJlIGNhY2hlZCwgZWRpdCBMb2NhbCBTdG9yYWdlIGNhY2hlIG5hbWVzXG4gICAgICAgIGxldCB3b3JkY2FjaGU6IGxvY2Fsc3RvcmFnZXdvcmR2YWx1ZSA9IHtcbiAgICAgICAgICAgIGluQ2FjaGU6IHNlbmRUb0NhY2hlLFxuICAgICAgICAgICAgd29yZDogd29yZCxcbiAgICAgICAgICAgIHdvcmRVUkw6IHdvcmRVcmwsXG4gICAgICAgICAgICBjYWNoZU5hbWU6IHNlbmRUb0NhY2hlID8gY2FjaGVOYW1lIDogXCJcIixcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdvcmRGZXRjaFJlcXVlc3QgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAvL3NldCBhcGlHRVQ6OnNlbmRUb0Jyb3dzZXJDYWNoZSB0byB0cnVlIHRvIHVzZSBjYWNoZSBzdG9yYWdlXG4gICAgICAgICAgICBjb25zdCB3b3JkRmV0Y2ggPSBuZXcgYXBpR0VUKHdvcmRjYWNoZS53b3JkVVJMLCBmYWxzZSwgd29yZGNhY2hlLmNhY2hlTmFtZSwgZWxlbXMuZXJyb3JFbGVtKTtcbiAgICAgICAgICAgIGxldCBub0RlZmluaXRpb25zOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vZmV0Y2ggcmVxdWVzdFxuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCB3b3JkRmV0Y2guYXBpR0VUKHdvcmRGZXRjaC5nZXRHRVRVUkwoKSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB3b3JkRGF0YTogYW55ID0gZGF0YTtcbiAgICAgICAgICAgIC8vY2hlY2sgaWYgdGhlIHJldHVybmVkIG9iamVjdCBpcyB2YWxpZCB3b3JkIGRhdGEgZGVmaW5pdGlvbnNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaGFzT3duKHdvcmREYXRhLCAndGl0bGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyBkZWZpbml0aW9ucyB3ZXJlIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgIG5vRGVmaW5pdGlvbnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhICE9IHVuZGVmaW5lZCAmJiAhbm9EZWZpbml0aW9ucykgeyAvLyBnb29kIGZldGNoLS0+IG1vdmUgZm9yd2FyZCB0byBtYXJrdXAgcmVuZGVyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGREaWN0aW9uYXJ5VGVybXRvTG9jYWxTdG9yYWdlKHdvcmRGZXRjaC5nZXRTZW5kVG9Ccm93c2VyQ2FjaGUoKSwgd29yZGNhY2hlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0b3Iub25MaW5lICE9PSBmYWxzZSkgeyAvLyBjaGVjayBuZXR3b3JrIHN0YXR1cyB2aWEgbmF2aWdhdG9yIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiAobm9EZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmREYXRhLnRpdGxlID09IFwiTm8gRGVmaW5pdGlvbnMgRm91bmRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtcy5zZWFyY2hXb3JkLmNsYXNzTGlzdC5hZGQoXCJpbnZhbGlkLW5vdGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbXMuZXJyb3JFbGVtLmNsYXNzTGlzdC5hZGQoXCJlcnJvci1ub3Rmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1zLmVycm9yRWxlbS5pbm5lclRleHQgPSBcIk5vIERlZmluaXRpb25zIEZvdW5kXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtcy5zZWFyY2hXb3JkLmNsYXNzTGlzdC5hZGQoXCJpbnZhbGlkLW5vdGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbXMuZXJyb3JFbGVtLmNsYXNzTGlzdC5hZGQoXCJlcnJvci1ub3Rmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1zLmVycm9yRWxlbS5pbm5lclRleHQgPSBcIkludmFsaWQgd29yZCFcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbXMuZXJyb3JFbGVtLmlubmVyVGV4dCArPSBcIiwgY2hlY2sgbmV0d29yayBjb25uZWN0aW9uLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHdvcmREYXRhID0gd29yZEZldGNoUmVxdWVzdCgpO1xuICAgICAgICByZXR1cm4gd29yZERhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3b3JkVmFsaWRhdGlvbihpbnR4dDogc3RyaW5nKSB7XG4gICAgICAgIGxldCB0cmltbWVkID0gaW50eHQudHJpbSgpO1xuICAgICAgICBsZXQgbGV0dGVyc1JFID0gbmV3IFJlZ0V4cChcIl5bQS1aYS16XXsxLDQ1fSRcIik7XG4gICAgICAgIGlmIChsZXR0ZXJzUkUudGVzdCh0cmltbWVkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL3dvcmQgaXMgbm90IGFuIGFjY2VwdGFibGUgd29yZC5gKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsbEZldGNoRGljdGlvbmFyeVRlcm0oc2VhcmNoRWxlbXM6IERpY3Rpb25hcnlTZWFyY2hFbGVtZW50cywgd29yZDogc3RyaW5nLCB3b3JkVVJMOiBVUkwpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgd29yZCBkYXRhIHJlc29sdmVzLCBjYWxsIG1hcmt1cCBmdW5jdGlvbnNcbiAgICAgICAgbGV0IHdvcmREYXRhUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMuZmV0Y2hEaWN0aW9uYXJ5VGVybSh3b3JkLCB3b3JkVVJMLCBzZWFyY2hFbGVtcywgZmFsc2UsIG51bGwpKTtcbiAgICAgICAgfSlcbiAgICAgICAgd29yZERhdGFQcm9taXNlLnRoZW4oKGRhdGE6IG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53b3JkRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURpY3Rpb25hcnlUZXJtV2l0aE1hcmt1cChkYXRhLCBzZWFyY2hFbGVtcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlbW92ZSB1bm5lZWRlZCBjbGFzc2VzIGlmIGFwcGxpZWQgcHJldmlvdXNseVxuICAgICAgICBzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLmNsYXNzTGlzdC5yZW1vdmUoXCJpbnZhbGlkXCIpO1xuICAgICAgICBzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLmNsYXNzTGlzdC5yZW1vdmUoXCJpbnZhbGlkLW5vdGZvdW5kXCIpO1xuICAgICAgICBzZWFyY2hFbGVtcy5lcnJvckVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xuICAgICAgICBzZWFyY2hFbGVtcy5lcnJvckVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImVycm9yLW5vdGZvdW5kXCIpO1xuICAgICAgICBzZWFyY2hFbGVtcy5lcnJvckVsZW0udGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH1cblxuICAgIHByaXZhdGUgd29yZFNlYXJjaChzZWFyY2hFbGVtczogRGljdGlvbmFyeVNlYXJjaEVsZW1lbnRzLCBpc0Zyb21QcmV2aW91c1dvcmRzOiBib29sZWFuLCBjYWNoZWRXb3JkOiBsb2NhbHN0b3JhZ2V3b3JkdmFsdWUgfCBudWxsKSB7XG4gICAgICAgIGlmIChpc0Zyb21QcmV2aW91c1dvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxGZXRjaERpY3Rpb25hcnlUZXJtKHNlYXJjaEVsZW1zLCBjYWNoZWRXb3JkLndvcmQsIGNhY2hlZFdvcmQud29yZFVSTCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBUYWtlIHVzZXIgaW5wdXQgYW5kIGZpbHRlciB0byBhbiBhY2NlcHRlZCBzdHJpbmdcbiAgICAgICAgICAgIGxldCBhY2NlcHRlZElucHV0V29yZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy53b3JkVmFsaWRhdGlvbihzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLnZhbHVlKVxuICAgICAgICAgICAgICAgID8gYWNjZXB0ZWRJbnB1dFdvcmQgPSB0cnVlIDogYWNjZXB0ZWRJbnB1dFdvcmQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChhY2NlcHRlZElucHV0V29yZCkge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIFVSTCBvZiB0aGUgYWNjZXB0ZWQgd29yZCBmb3IgdXNlIGluIHRoZSBmZXRjaCBjYWxsXG4gICAgICAgICAgICAgICAgdGhpcy53b3JkVVJMID0gbmV3IFVSTChzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLnZhbHVlLnRvU3RyaW5nKCksIERpY3Rpb25hcnlTZWFyY2gucmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsRmV0Y2hEaWN0aW9uYXJ5VGVybShzZWFyY2hFbGVtcywgc2VhcmNoRWxlbXMuc2VhcmNoV29yZC52YWx1ZSwgdGhpcy53b3JkVVJMKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoRWxlbXMuc2VhcmNoV29yZC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52YWxpZC1ub3Rmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICBzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLmNsYXNzTGlzdC5hZGQoXCJpbnZhbGlkXCIpO1xuICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1zLmVycm9yRWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3Itbm90Zm91bmRcIik7XG4gICAgICAgICAgICAgICAgc2VhcmNoRWxlbXMuZXJyb3JFbGVtLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICBzZWFyY2hFbGVtcy5lcnJvckVsZW0udGV4dENvbnRlbnQgPSBcIkludmFsaWQgd29yZCFcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWFyY2hFbGVtcy5zZWFyY2hXb3JkLnZhbHVlID0gJyc7IC8vIHJlc2V0IGlucHV0IHN0cmluZ1xuICAgIH1cbn1cblxuIiwiLy8tLUNvcHlyaWdodCAoYykgUm9iZXJ0IEEuIEhvd2VsbFxuaW1wb3J0IHsgRGljdGlvbmFyeVNlYXJjaEVsZW1lbnRzIH0gZnJvbSAnLi93aWRnZXRpbnRlcmZhY2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnlTZWFyY2hXaWRnZXQge1xuICAgIHB1YmxpYyBjcmVhdGVEaWN0aW9uYXJ5V2lkZ2V0TWFya3VwKGVsZW06IEVsZW1lbnQpIHtcbiAgICAgICAgLy9pbnNlcnQgdGhlIHdpZGdldCBhZnRlciB0aGUgcGFzc2VkIGluIFwiZWxlbVwiXG4gICAgICAgIGlmIChlbGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdC5jb250YWlucyhcImRpY3Rpb25hcnlXaWRnZXRcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWN0aW9uYXJ5ID0gZWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRpY3Rpb25hcnkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgd2lkZ2V0IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFydEggPSBkaWN0aW9uYXJ5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaEZvcm0gPSBkaWN0aW9uYXJ5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNXb3JkcyA9IGRpY3Rpb25hcnkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSlcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGVsZW1lbnRzIHVzZWQgaW4gbGF0ZXIgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWFyY2hFbGVtZW50czogRGljdGlvbmFyeVNlYXJjaEVsZW1lbnRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoV29yZDogc2VhcmNoRm9ybS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgd29yZFNlYXJjaDogc2VhcmNoRm9ybS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Rpb25hcnlFbGVtOiA8SFRNTEVsZW1lbnQ+ZGljdGlvbmFyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yRWxlbTogc2VhcmNoRm9ybS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1dvcmRCdG46IHByZXZpb3VzV29yZHMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoQnRuOiBwcmV2aW91c1dvcmRzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIikpLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhdHRyaWJ1dGVzIGFuZCBwcm9wZXJ0eSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNXb3Jkcy5jbGFzc0xpc3QuYWRkKFwicHJldmlvdXNXb3Jkc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoRWxlbWVudHMuc2VhcmNoV29yZC5jbGFzc0xpc3QuYWRkKFwibW9ub3NwYWNlXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50cy5wcmV2aW91c1dvcmRCdG4uY2xhc3NMaXN0LmFkZChcImRpY3Rpb25hcnktYnRuXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50cy5yZWZyZXNoQnRuLmNsYXNzTGlzdC5hZGQoXCJkaWN0aW9uYXJ5LWJ0blwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoRWxlbWVudHMuc2VhcmNoV29yZC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50cy5zZWFyY2hXb3JkLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnU2VhcmNoLi4uJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnRzLnNlYXJjaFdvcmQuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIklucHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50cy53b3JkU2VhcmNoLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoRWxlbWVudHMud29yZFNlYXJjaC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiU2VhcmNoXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50cy53b3JkU2VhcmNoLmlubmVyVGV4dCA9IFwiRmV0Y2hcIjtcbiAgICAgICAgICAgICAgICAgICAgZGljdGlvbmFyeS5pZCA9IFwiZGljdGlvbmFyeVwiO1xuICAgICAgICAgICAgICAgICAgICBhcnRILnRleHRDb250ZW50ID0gXCJEaWN0aW9uYXJ5IFRlcm06XCI7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEZvcm0uaWQgPSBcImRpY3Rpb25hcnktc2VhcmNoXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEZvcm0uYWN0aW9uID0gXCJpbmRleC5odG1sXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnRzLnNlYXJjaFdvcmQuaWQgPSBcInNlYXJjaC13b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnRzLndvcmRTZWFyY2guaWQgPSBcIndvcmQtc2VhcmNoXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnRzLnByZXZpb3VzV29yZEJ0bi5pbm5lclRleHQgPSBcIlByZXZpb3VzIFdvcmQgU2VhcmNoZXNcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoRWxlbWVudHMucmVmcmVzaEJ0bi5pbm5lclRleHQgPSBcIlJlZnJlc2hcIjtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoRWxlbWVudHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBkZXRlcm1pbmVkIGRpY3Rpb25hcnkgZWxlbWVudCBpcyBudWxsLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQWRkIFwiZGljdGlvbmFyeVdpZGdldFwiIGNsYXNzIHRvICR7ZWxlbS5ub2RlTmFtZX0gbm9kZS5gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFRoZXJlIGlzIG5vIFwiZGljdGlvbmFyeVdpZGdldFwiIGNsYXNzIG9uIHRoaXMgcGFnZS5gKVxuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBjcmVhdGVEaWN0aW9uYXJ5VGVybVdpdGhNYXJrdXAod29yZERhdGE6IGFueSwgc2VhcmNoRWxlbXM6IERpY3Rpb25hcnlTZWFyY2hFbGVtZW50cykge1xuICAgICAgICBpZiAod29yZERhdGEgPT0gbnVsbCB8fCAhKHdvcmREYXRhIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZGF0YSBpcyBudWxsIG9yIGFuIGluY29ycmVjdCB0eXBlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdGhlIHdvcmQncyBkZWZpbml0aW9uIHRvIHRoZSBkaWN0aW9uYXJ5IHdpZGdldFxuICAgICAgICBjb25zdCBkZWZpbml0aW9uRGVzY3JpcHRpb25Db250YWluZXIgPSBzZWFyY2hFbGVtcy5kaWN0aW9uYXJ5RWxlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbkRlc2NyaXB0aW9uID0gZGVmaW5pdGlvbkRlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICBkZWZpbml0aW9uRGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpKTsgLy8gd29yZCBkZWZpbml0aW9uIHNlcGFyYXRvclxuICAgICAgICBkZWZpbml0aW9uRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImRlZmluaXRpb25EZXNjcmlwdGlvblwiKTtcblxuICAgICAgICAvLyBUaGUgd29yZCBkYXRhIHJlcHJlc2VudHMgY29tcGxleCBKU09OIG9iamVjdFxuICAgICAgICAvLyBSZWN1cnNlIHRoZSB3b3JkIGRhdGEgb2JqZWN0LCBhZGRpbmcgZWxlbWVudHMgZnJvbSB0aGUgdmFyaW91cyBsZXZlbHNcbiAgICAgICAgd29yZERhdGEubWFwKCh3b3JkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUaGUgd29yZCBpczogXCIsd29yZClcbiAgICAgICAgICAgIGNvbnN0IHdvcmRUaXRsZSA9IGRlZmluaXRpb25EZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIikpO1xuICAgICAgICAgICAgd29yZFRpdGxlLnRleHRDb250ZW50ID0gd29yZC53b3JkO1xuICAgICAgICAgICAgLy9BZGQgdGhlIHdvcmQgYW5kIGV4YW1wbGVzIHRvIHBhZ2VcbiAgICAgICAgICAgIHdvcmQubWVhbmluZ3MubWFwKCh3b3JkVHlwZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIldvcmRUeXBlIGFyZTogXCIsIHdvcmRUeXBlKVxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRUeXBlSCA9IGRlZmluaXRpb25EZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIikpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRUeXBlTGlzdCA9IGRlZmluaXRpb25EZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIikpO1xuICAgICAgICAgICAgICAgIHdvcmRUeXBlSC50ZXh0Q29udGVudCA9IHdvcmRUeXBlLnBhcnRPZlNwZWVjaDtcbiAgICAgICAgICAgICAgICB3b3JkVHlwZS5kZWZpbml0aW9ucy5tYXAoKGRlZjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJEZWZpbml0aW9uIGlzOiBcIiwgZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmRUeXBlRGVmSXRlbSA9IHdvcmRUeXBlTGlzdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIikpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVmaW5pdGlvblAgPSB3b3JkVHlwZURlZkl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIikpO1xuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uUC50ZXh0Q29udGVudCA9IGRlZi5kZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uUC5jbGFzc0xpc3QuYWRkKFwid29yZERlZmluaXRpb25cIilcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGRBZGphY2VudEVsZW0gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRGVmaW5pdGlvbnMgaXM6IFwiLCBkZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UCA9IGRlZmluaXRpb25QLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlZW5kJywgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1AgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BpID0gbmV3UC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGkudGV4dENvbnRlbnQgPSBkZWYuZXhhbXBsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluaXRpb25QLmNsYXNzTGlzdC5hZGQoXCJleGFtcGxlXCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBpZiBrZXkgXCJleGFtcGxlXCIgaXMgaW4gZGVmaW5pdGlvbi4gSWYgaXQgaXMsIGFkZCB0aGUgZXhhbXBsZSB0byBsaXN0XG4gICAgICAgICAgICAgICAgICAgIFwiZXhhbXBsZVwiIGluIGRlZiA/IGFkZEFkamFjZW50RWxlbSgpIDogdHJ1ZSA9PSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlZmluaXRpb25EZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChkZWZpbml0aW9uRGVzY3JpcHRpb24pO1xuICAgIH1cbn0iLCIvLy0tQ29weXJpZ2h0IChjKSBSb2JlcnQgQS4gSG93ZWxsICBNYXksIDIwMjNcclxuXHJcbmV4cG9ydCBjbGFzcyBhcGlHRVQge1xyXG4gICAgcHJpdmF0ZSBHRVRVUkw6IFVSTDtcclxuICAgIHByaXZhdGUgc2VuZFRvQnJvd3NlckNhY2hlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGJyb3dzZXJDYWNoZU5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBlcnJvckVsZW06IEhUTUxFbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihHRVRVUkw6IFVSTCwgc2VuZFRvQnJvd3NlckNhY2hlOiBib29sZWFuLCBicm93c2VyQ2FjaGVOYW1lOiBzdHJpbmcsIGVycm9yRWxlbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLkdFVFVSTCA9IEdFVFVSTDtcclxuICAgICAgICB0aGlzLnNlbmRUb0Jyb3dzZXJDYWNoZSA9IHNlbmRUb0Jyb3dzZXJDYWNoZTtcclxuICAgICAgICB0aGlzLmJyb3dzZXJDYWNoZU5hbWUgPSBicm93c2VyQ2FjaGVOYW1lO1xyXG4gICAgICAgIHRoaXMuZXJyb3JFbGVtID0gZXJyb3JFbGVtO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZW5kVG9Ccm93c2VyQ2FjaGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFRvQnJvd3NlckNhY2hlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHRVRVUkwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuR0VUVVJMO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgc2V0U2VuZFRvQnJvd3NlckNhY2hlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRUb0Jyb3dzZXJDYWNoZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0R0VUVVJMKEdFVFVSTDogVVJMIHwgc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBHRVRVUkwgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICAgICAgdGhpcy5HRVRVUkwgPSBuZXcgVVJMKEdFVFVSTCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLkdFVFVSTCA9IEdFVFVSTDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhcGlSZXNwb25zZUVycm9yQ2hlY2socmVzOiBSZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXMuc3RhdHVzID09IDQwNCl7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JFbGVtLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvckVsZW0uaW5uZXJUZXh0ID0gXCI0MDQgZmV0Y2ggZXJyb3IhXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVzLm9rIHx8IHJlcy5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXMub2sgKyBcIjogXCIgKyByZXMuc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hEYXRhKEdFVFVSTDogVVJMKSB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKEdFVFVSTClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gdGhpcy5hcGlSZXNwb25zZUVycm9yQ2hlY2socmVzcG9uc2UpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yRWxlbS5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JFbGVtLmlubmVyVGV4dCA9IGAke2UubWVzc2FnZX1gO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgcHVibGljIGFzeW5jIGFwaUdFVChHRVRVUkw6IFVSTCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbmRUb0Jyb3dzZXJDYWNoZSl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhQ2FjaGVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJ2NhY2hlcycgaW4gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlbiBjYWNoZSBhbmQgY2hlY2sgZm9yIHJlcXVlc3QgZXhpc3RpbmcgaW4gQ2FjaGUgU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jYWNoZXMub3Blbih0aGlzLmJyb3dzZXJDYWNoZU5hbWUpLnRoZW4oKGNhY2hlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlcy5tYXRjaChHRVRVUkwpLnRoZW4oKHJlc3VsdCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmV0Y2ggdGhlIHJlcXVlc3Qgbm9ybWFsbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaChHRVRVUkwpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIGEgY29weSBvZiB0aGUgcmVzcG9uc2Ugc2luY2UgaXQgY2FuIG9ubHkgYmUgcmVhZCBvbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbG9uZWRyZXNwID0gcmVzdWx0LmNsb25lKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVzdWx0IHRvIHRoZSBjYWNoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5wdXQoR0VUVVJMLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvcmQgY2FjaGVkIHRvIGNhY2hlIHN0b3JhZ2UuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2xvbmVkcmVzcC5qc29uKCkudGhlbigodGV4dCkgPT4gdGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvcmQgc2VhcmNoIHJlc3BvbnNlIHJldHJpZXZlZCBmcm9tIGNhY2hlIHN0b3JhZ2UuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuanNvbigpLnRoZW4oKHRleHQpID0+IHRleHQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBkYXRhQ2FjaGVQcm9taXNlLnRoZW4oIChyZXNwb25zZTphbnkpICA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YUNhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmZldGNoRGF0YShHRVRVUkwpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBkYXRhUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJXb3JkIHNlYXJjaCByZXNwb25zZSByZXRyaWV2ZWQgdmlhIGZldGNoLlwiKVxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YVByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8tLUNvcHlyaWdodCAoYykgUm9iZXJ0IEEuIEhvd2VsbCAgTWF5LCAyMDIzXHJcblxyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5U2VhcmNoIH0gZnJvbSAnLi9EaWN0aW9uYXJ5U2VhcmNoJ1xyXG5cclxuXHJcbmNvbnN0IGRpY3Rpb25hcnlXaWRnZXQgPSB7XHJcbiAgICBpbml0OiAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGljdGlvbmFyeVdpZGdldCcpIGFzIEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIGRpY3Rpb25hcnkgd2lkZ2V0LCBjYWxsIGNyZWF0ZVxyXG4gICAgICAgIG5ldyBEaWN0aW9uYXJ5U2VhcmNoKGVsZW0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZGljdGlvbmFyeVdpZGdldC5pbml0KCk7Il19
