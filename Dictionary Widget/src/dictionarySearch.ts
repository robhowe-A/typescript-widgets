//--Copyright (c) Robert A. Howell  May, 2023
import { ApiGet } from "./api";
import { DictionarySearchElements, localstoragewordvalue } from './widgetInterface'
import DictionarySearchWidget from "./dictionarySearchWidget"

/**
 * A DictionarySearch is a set of markup creation and functions which allow a user
 *  to look up a word like a Dictionary. When called, the user's input is validated
 *  as an acceptable word or it declines the request, then showing the user if the word
 *  is acceptable.
 * 
 * Creating a dictionary search widget requires passing a reference element (for a
 *  known placement location) that contains the 'dictionaryWidget' class.
 * 
 *   new DictionarySearch(elem);
 * 
 * All the needed elements and functionality are added to the page.
 * 
 */
export class DictionarySearch extends DictionarySearchWidget {
    public static wordStorage: localstoragewordvalue[];
    private static requestUrl: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    private previousWordsBtnIsCreated: boolean = false;
    private previousWordsBtnWasClicked: boolean = false;
    private previousWordsNotFoundOnce: boolean = false;
    private wordURL: URL;
    private wordData: object;
    private dictionarySearchMarkup: DictionarySearchElements;

    /**
     * This constructor creates all the functionality and markup needed for the 
     *  Dictionary Search widget interface.
     * 
     * @param elem - The reference element used to place widget markup.
     */
    constructor(elem: Element) {
        super();
        this.dictionarySearchMarkup = this.createDictionaryWidgetMarkup(elem)!;
        this.addWidgetEvents();
        DictionarySearch.getLocalStorageWordCaches();
        //new dictionary. no initializing functions needed
        //static class - needs to show on browser any caches that exist
        //and their names
    }

    /**
     * Retrieve Local Storage words previously stored with the Dictionary Search Widget.
     * 
     * @returns DictionarySearch.wordStorage - these are the words stored previously in the
     *  browser cache.
     */
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

    /**
     * Call to return the previously searched word.
     * 
     * @returns this.wordURL
     */
    public getWordURL() {
        return this.wordURL;
    }

    /**
     * Call to return the fetched word data.
     * 
     * @returns this.wordData
     */
    public getWordData() {
        return this.wordData;
    }

    /**
     * Adds click and keypress event listeners to the widget. Input event listeners 'click'
     *  and 'keypress' await for a search call. Also, should a user want to search a
     *  previously searched word, the widget adapts markup for that request.
     */
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

    /** 
     * Adds the fetched term to the browser's Local Storage --> Key/Value 
     * data referencing if words are in local cache.
     * 
     * @param sendToBrowserCache - //TODO: implemented with Cache Storage use
     * @param localstoragevalue - This is an interface implementation, storing
     *  information where sending to local storage.
     */
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

    /**
     * This function structures inbound fetch request before sending an API fetch 
     * request. apiGET() is created and called based on parameter data.
     * 
     * @param word - The word searched from widget input.
     * @param wordUrl - The fetch request URL.
     * @param searchElems - Widget Elements -- used for data validation.
     * @param sendToCache - ? Send fetch request to Cache Storage : Fetch without storing the request.
     * @param cacheName - If sending fetch requests to cache, provide a name to store it under.
     * @returns - wordData: Promise<unknown>
     */
    private fetchDictionaryTerm(word: string, wordUrl: URL, searchElems: DictionarySearchElements,
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
            const wordFetch = new ApiGet(wordcache.wordURL, false, searchElems.errorElem, wordcache.cacheName);
            let noDefinitions: boolean = false;

            //fetch request
            let data = await wordFetch.apiGET(wordFetch.getGetUrl());
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
                            searchElems.searchWord.classList.add("invalid-notfound");
                        searchElems.errorElem.classList.add("error-notfound");
                        searchElems.errorElem.innerText = "No Definitions Found";
                    }
                    else {
                        searchElems.searchWord.classList.add("invalid-notfound");
                        searchElems.errorElem.classList.add("error-notfound");
                        searchElems.errorElem.innerText = "Invalid word!";
                    }
                }
                else {
                    searchElems.errorElem.innerText += ", check network connection.";
                }
            }
        };
        let wordData = wordFetchRequest();
        return wordData;
    }

    /** 
     * User input validation function tests the input string against a valid Regular Expression.
     * 
     * RegExp("^[A-Za-z]{1,45}$")
     * 
     * @param intxt - String value received from user field input.
     * @returns Acceptable user input: true or false.
     */
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

    /**
     * callFetchDictionaryTerm creates a promise to fetch a dictionary term.
     * Of data ingress ti DictionarySearch, markup creation is called for.
     *
     * @param searchElems - Widget Elements -- used for data validation.
     * @param word - The word to be fetched.
     * @param wordURL - A URL object composing the full string of the fetch request.
     */
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

    /**
     * wordSearch() begins a word search request. The user input listener chooses 
     * whether the fetch is called from cache or is new.
     * 
     * @param searchElems - Widget Elements -- used for data validation.
     * @param isFromPreviousWords - True if the user requested a search from a previous word, to call data from Browser Cache.
     * @param cachedWord - If the user called for a previous word, cachedWord is within the Local Storage.
     */
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