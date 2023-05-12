//--Copyright (c) Robert A. Howell
import { apiGET } from "./api";
import { DictionarySearchElements, localstoragewordvalue } from './widgetinterface'
import DictionarySearchWidget from "./DictionarySearchWidget"

export class DictionarySearch extends DictionarySearchWidget {
    public static wordStorage: localstoragewordvalue[];
    private static requestUrl: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    private previousWordsBtnIsCreated: boolean = false;
    private previousWordsBtnWasClicked: boolean = false;
    private previousWordsNotFoundOnce: boolean = false;
    private wordURL: URL;
    private wordData: object;
    private dictionarySearchMarkup: DictionarySearchElements;

    constructor(elem: Element) {
        super();
        this.dictionarySearchMarkup = this.createDictionaryWidgetMarkup(elem)!;
        this.addWidgetEvents();
        DictionarySearch.getLocalStorageWordCaches();
        //new dictionary. no initializing functions needed
        //static class - needs to show on browser any caches that exist
        //and their names
    }

    public static getLocalStorageWordCaches() {
        //enumerate all of the caches
        //cache response links and cache name are previously stored in local storage

        //Enumerate local storage 'word-caches' items
        let storageStr = localStorage.getItem('word-caches');
        if (storageStr != null) {
            DictionarySearch.wordStorage = JSON.parse(storageStr);
            return DictionarySearch.wordStorage;
        }
    }

    public getWordURL() {
        return this.wordURL;
    }

    public getWordData() {
        return this.wordData;
    }

    private addWidgetEvents() {
        if (this.dictionarySearchMarkup == undefined) {
            console.log("A search element is undefined from searchWord | wordSearch");
            return;
        }
        //Add form input event listeners
        //Upon input entry, fire API fetch
        this.dictionarySearchMarkup.wordSearch.addEventListener("click", (event) => {
            event.preventDefault();
            this.wordSearch(this.dictionarySearchMarkup, false, null);
        })
        this.dictionarySearchMarkup.searchWord.addEventListener("keypress", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.wordSearch(this.dictionarySearchMarkup, false, null);
            }
        })
        // "Previous word searches" button fetches locally stored words
        // Clicking the button displays each word in a list within the widget
        this.dictionarySearchMarkup.previousWordBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const placementlocationholder = document.querySelector(".previousWords")!;
            let buttonContainer = document.getElementById("dictionary-btns")!;
            let newButtonContainer: Element;
            if (this.previousWordsBtnWasClicked == false) {
                if (this.previousWordsBtnIsCreated == false) {
                    newButtonContainer = placementlocationholder.insertAdjacentElement('afterend', document.createElement("div"))!;
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
                            })
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
        })
        this.dictionarySearchMarkup.refreshBtn.addEventListener("click", (event) => {
            event.preventDefault();
            location.reload();
        })
    }

    private addDictionaryTermtoLocalStorage(sendToBrowserCache: boolean, localstoragevalue: localstoragewordvalue) {
        let wordStore: any = [];
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
                let allcache: localstoragewordvalue[] = JSON.parse(storageStr);
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

    private fetchDictionaryTerm(word: string, wordUrl: URL, elems: DictionarySearchElements,
        sendToCache: boolean, cacheName: string | null) {
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
        let wordcache: localstoragewordvalue = {
            inCache: sendToCache,
            word: word,
            wordURL: wordUrl,
            cacheName: sendToCache ? cacheName : "",
        }

        const wordFetchRequest = async () => {
            //set apiGET::sendToBrowserCache to true to use cache storage
            const wordFetch = new apiGET(wordcache.wordURL, false, wordcache.cacheName, elems.errorElem);
            let noDefinitions: boolean = false;

            //fetch request
            let data = await wordFetch.apiGET(wordFetch.getGETURL());
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            let wordData: any = data;
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

    private wordValidation(intxt: string) {
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

    private callFetchDictionaryTerm(searchElems: DictionarySearchElements, word: string, wordURL: URL) {
        // When the word data resolves, call markup functions
        let wordDataPromise = new Promise((resolve) => {
            resolve(this.fetchDictionaryTerm(word, wordURL, searchElems, false, null));
        })
        wordDataPromise.then((data: object) => {
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

    private wordSearch(searchElems: DictionarySearchElements, isFromPreviousWords: boolean, cachedWord: localstoragewordvalue | null) {
        if (isFromPreviousWords) {
            this.callFetchDictionaryTerm(searchElems, cachedWord.word, cachedWord.wordURL);
        }
        else {
            // Take user input and filter to an accepted string
            let acceptedInputWord: boolean = false;
            this.wordValidation(searchElems.searchWord.value)
                ? acceptedInputWord = true : acceptedInputWord = false;
            if (acceptedInputWord) {
                // Create a URL of the accepted word for use in the fetch call
                this.wordURL = new URL(searchElems.searchWord.value.toString(), DictionarySearch.requestUrl);
                this.callFetchDictionaryTerm(searchElems, searchElems.searchWord.value, this.wordURL)
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

