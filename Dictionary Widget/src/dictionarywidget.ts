//--Copyright (c) Robert A. Howell  May, 2023
import { apiGET } from "./api";
import { DictionarySearchElements, localstoragewordcache } from './widgetinterface'

class DictionaryWidget {
    private static requestUrl: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    public static wordCaches: localstoragewordcache[];
    public static previousWordsBtnWasClicked: boolean = false;
    public static previousWordsBtnIsCreated: boolean = false;
    public static previousWordsNotFoundOnce: boolean = false;
    public wordURL: URL;

    constructor() {}

    public createDictionaryWidget(elem: Element) {
        var Srchelements = DictionaryWidgetMarkup.createDictionaryWidgetMarkup(elem);

        // Initialize event listeners: word search, button clicks, etc
        this.addWordSearchEvents(Srchelements);

        // Find items pre-existing in local storage/cache
        DictionaryWidget.getLocalStorageWordCaches();
    }

    public static getLocalStorageWordCaches() {
        //enumerate all of the caches
        //cache response links and cache name are previously stored in local storage

        //Enumerate local storage 'word-caches' items
        let storageStr = localStorage.getItem('word-caches');
        if (storageStr != null) {
            DictionaryWidget.wordCaches = JSON.parse(storageStr);
            return DictionaryWidget.wordCaches;
        }
    }

    public addWordSearchEvents(searchElems: DictionarySearchElements | undefined) {
        if (searchElems == undefined) {
            console.log("A search element is undefined from searchWord | wordSearch");
            return;
        }
        //Add form input event listeners
        //Upon input entry, fire API fetch
        searchElems.wordSearch.addEventListener("click", (event) => {
            event.preventDefault();
            this.wordSearchUpdate(searchElems);
        })
        searchElems.searchWord.addEventListener("keypress", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.wordSearchUpdate(searchElems);
            }
        })
        // "Previous word searches" button fetches locally stored words
        // Clicking the button displays each word in a list within the widget
        searchElems.previousWordBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const placementlocationholder = document.querySelector(".previousWords");
            let buttonContainer = document.getElementById("dictionary-btns");
            let newButtonContainer: Element;
            if (DictionaryWidget.previousWordsBtnWasClicked == false) {
                if (DictionaryWidget.previousWordsBtnIsCreated == false) {
                    newButtonContainer = placementlocationholder.insertAdjacentElement('afterend', document.createElement("div"));
                    newButtonContainer.id = "dictionary-btns";
                    //Check the placement location and word caches for undefined
                    if (placementlocationholder != undefined && DictionaryWidget.wordCaches !== undefined) {
                        for (let wordCache of DictionaryWidget.wordCaches) {
                            const cacheWordHeadingElem = newButtonContainer.appendChild(document.createElement("button"));
                            cacheWordHeadingElem.setAttribute("type", "button");
                            cacheWordHeadingElem.classList.add("dictionary-btn", "dictionary-word-btn");
                            cacheWordHeadingElem.textContent = wordCache.word;
                            //add event listener for new button
                            cacheWordHeadingElem.addEventListener("click", (event) => {
                                event.preventDefault();
                                this.fetchDictionaryTerm(wordCache.word, wordCache.wordURL, searchElems, false, "");
                            })
                            DictionaryWidget.previousWordsBtnIsCreated = true;
                        }
                    }
                    else {
                        if (DictionaryWidget.previousWordsNotFoundOnce == false) {
                            const noWordsHeadingElem = newButtonContainer.appendChild(document.createElement("div"));
                            noWordsHeadingElem.classList.add("dictionary-btn", "error-notfound");
                            noWordsHeadingElem.textContent = "Previous words not found. The cache is empty.";
                            DictionaryWidget.previousWordsNotFoundOnce = true;
                            DictionaryWidget.previousWordsBtnWasClicked = true;
                        }
                        else {
                            buttonContainer.style.display = "block";
                            DictionaryWidget.previousWordsBtnWasClicked = true;
                            return;
                        }
                    }
                }
                else {
                    buttonContainer.style.display = "block";
                    DictionaryWidget.previousWordsBtnWasClicked = true;
                    return;
                }
            }
            else {
                buttonContainer.style.display = "none";
                DictionaryWidget.previousWordsBtnWasClicked = false;
                return;
            }
            DictionaryWidget.previousWordsBtnWasClicked = true;
        })
        searchElems.refreshBtn.addEventListener("click", (event) => {
            event.preventDefault();
            location.reload();
        })
    }

    private addDictionaryTermtoLocalStorage(sendToBrowserCache: boolean, wordcache: localstoragewordcache, wordArray: any[],) {
        // Add the cache item to Local Storage
        try {
            if (localStorage.getItem('word-caches') == null) {
                // Local storage empty => add the word
                localStorage.setItem('word-caches', JSON.stringify(wordArray));
            }
            else {
                // Add word to current 'word-caches' in local storage
                let storageStr = localStorage.getItem('word-caches');
                if (storageStr == null) {
                    try {
                        throw new Error("Local storage 'word-caches' values null.");
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
                    let allcache: localstoragewordcache[] = JSON.parse(storageStr);
                    for (let cache of allcache) {
                        if (cache.wordURL == wordcache.wordURL) {
                            // Word is already in local storage
                            // No need to add it to the array
                            return;
                        }
                    }

                    // Add word to existing 'word-caches' in local storage
                    allcache.push(wordcache);
                    localStorage.setItem('word-caches', JSON.stringify(allcache));
                }
            }
        }
        catch (err) {
            console.log("No items in 'word-caches' local storage. " + err ? `"Error: " + ${err}` : "" );
        }
    }

    private fetchDictionaryTerm(word: string, wordUrl: URL, elem: DictionarySearchElements,
        sendToCache: boolean, cacheName: string) {
        //TODO: dictionary cache management:
        //TODO: 1.) is to be cached true? --check
        //TODO: 2.) is to be cached false? --check
        //TODO: --> are they the same behavior? --check
        //TODO: --> is the result in the cache? --check
        //TODO: implement a delete from cache option
        //
        //
        // The function calls to either store in Cache Storage
        // If items are to be cached, edit Local Storage cache names
        let wordCacheStore: any = [];
        let wordcache: localstoragewordcache = {
            inCache: sendToCache,
            word: word,
            wordURL: wordUrl,
            cacheName: sendToCache ? cacheName : "",
        }
        wordCacheStore.push(wordcache);

        const wordFetchRequest = async () => {
            //set apiGET::sendToBrowserCache to true to use cache storage
            const wordFetch = new apiGET(wordcache.wordURL, false, wordcache.cacheName, elem.errorElem);

            //fetch request
            let data = await wordFetch.apiGET(wordFetch.getGETURL());
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            let wordData: any = data;
            let noDefinitions: boolean = false;
            if (typeof data == 'object') {
                if (Object.hasOwn(wordData, 'title')) {
                    noDefinitions = true;
                }
            }
            if (data != undefined && !noDefinitions) { // good fetch--> move forward to markup render
                DictionaryWidgetMarkup.createDictionaryTermWithMarkup(data, elem);
                this.addDictionaryTermtoLocalStorage(wordFetch.getSendToBrowserCache(), wordcache, wordCacheStore);
            }
            else {
                if (navigator.onLine !== false) { // check network status via navigator object
                    if (noDefinitions) {
                        if (wordData.title == "No Definitions Found")
                            elem.searchWord.classList.add("invalid-notfound");
                        elem.errorElem.classList.add("error-notfound");
                        elem.errorElem.innerText = "No Definitions Found";
                    }
                    else {
                        elem.searchWord.classList.add("invalid-notfound");
                        elem.errorElem.classList.add("error-notfound");
                        elem.errorElem.innerText = "Invalid word!";
                    }
                }
                else {
                    elem.errorElem.innerText += ", check network connection.";
                }
            }
        };
        wordFetchRequest();
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

    private wordSearchUpdate(searchElems: DictionarySearchElements) {
        // Take user input and filter to an accepted string
        let acceptedInputWord: boolean = false;
        this.wordValidation(searchElems.searchWord.value)
            ? acceptedInputWord = true : acceptedInputWord = false;
        if (acceptedInputWord) {
            // Create a URL of the accepted word for use in the fetch call
            this.wordURL = new URL(searchElems.searchWord.value.toString(), DictionaryWidget.requestUrl);
            this.fetchDictionaryTerm(searchElems.searchWord.value, this.wordURL, searchElems, false, "");

            // Remove unneeded classes if applied previously
            searchElems.searchWord.classList.remove("invalid");
            searchElems.searchWord.classList.remove("invalid-notfound");
            searchElems.errorElem.classList.remove("error");
            searchElems.errorElem.classList.remove("error-notfound");
            searchElems.errorElem.textContent = "";
        }
        else {
            searchElems.searchWord.classList.remove("invalid-notfound");
            searchElems.searchWord.classList.add("invalid");
            searchElems.errorElem.classList.remove("error-notfound");
            searchElems.errorElem.classList.add("error");
            searchElems.errorElem.textContent = "Invalid word!";
        }
        searchElems.searchWord.value = ''; // reset input string
    }
}


class DictionaryWidgetMarkup extends DictionaryWidget {

    public static createDictionaryWidgetMarkup(elem: Element) {
        //insert the widget after the passed in "elem"
        if (elem !== undefined) {
            if (elem.classList.contains("dictionaryWidget")) {
                const dictionary = elem.insertAdjacentElement("afterend", document.createElement("section"));
                if (dictionary != null) {
                    // Create widget elements
                    const artH = dictionary.appendChild(document.createElement("h3"));
                    const searchForm = dictionary.appendChild(document.createElement("form"));
                    const previousWords = dictionary.appendChild(document.createElement("div"))

                    // Return the elements used in later functions
                    let searchWords: DictionarySearchElements = {
                        searchWord: searchForm.appendChild(document.createElement("input")),
                        wordSearch: searchForm.appendChild(document.createElement("button")),
                        dictionaryElem: <HTMLElement>dictionary,
                        errorElem: searchForm.appendChild(document.createElement("span")),
                        previousWordBtn: previousWords.appendChild(document.createElement("button")),
                        refreshBtn: previousWords.appendChild(document.createElement("button")),
                    }

                    // Add attributes and property values
                    previousWords.classList.add("previousWords");
                    searchWords.searchWord.classList.add("monospace");
                    searchWords.previousWordBtn.classList.add("dictionary-btn");
                    searchWords.refreshBtn.classList.add("dictionary-btn");
                    searchWords.searchWord.setAttribute('type', 'text');
                    searchWords.searchWord.setAttribute('placeholder', 'Search...');
                    searchWords.searchWord.setAttribute("aria-label", "Input");
                    searchWords.wordSearch.setAttribute('type', 'button');
                    searchWords.wordSearch.setAttribute("aria-label", "Search");
                    dictionary.id = "dictionary";
                    artH.textContent = "Dictionary Term:";
                    searchForm.id = "dictionary-search";
                    searchForm.action = "index.html";
                    searchWords.searchWord.id = "search-word";
                    searchWords.wordSearch.id = "word-search";
                    searchWords.wordSearch.innerText = "Search";
                    searchWords.previousWordBtn.innerText = "Previous Word Searches";
                    searchWords.refreshBtn.innerText = "Refresh";

                    return searchWords;
                }
                else {
                    console.log("The determined dictionary element is null.");
                }
            }
            else {
                console.log(`Add "dictionaryWidget" class to ${elem.nodeName} node.`)
            }
        }
        else {
            console.log(`There is no "dictionaryWidget" class on this page.`)
        }
    }
    public static createDictionaryTermWithMarkup(wordData: any, searchElems: DictionarySearchElements) {

        // Add the word's definition to the dictionary widget
        const definitionDescriptionContainer = searchElems.dictionaryElem.appendChild(document.createElement("div"));
        const definitionDescription = definitionDescriptionContainer.appendChild(document.createElement("div"));
        definitionDescription.appendChild(document.createElement("hr")); // word definition separator
        definitionDescriptionContainer.classList.add("definitionDescription");

        // The word data represents complex JSON object
        // Recurse the word data object, adding elements from the various levels
        wordData.map((word: any) => {
            const wordTitle = definitionDescription.appendChild(document.createElement("h3"));
            wordTitle.textContent = word.word;
            //Add the word and examples to page
            word.meanings.map((wordType: any) => {
                const wordTypeH = definitionDescription.appendChild(document.createElement("h4"));
                const wordTypeList = definitionDescription.appendChild(document.createElement("ul"));
                wordTypeH.textContent = wordType.partOfSpeech;
                wordType.definitions.map((def: any) => {
                    let wordTypeDefItem = wordTypeList.appendChild(document.createElement("li"));
                    let definitionP = wordTypeDefItem.appendChild(document.createElement("p"));
                    definitionP.textContent = def.definition;
                    definitionP.classList.add("wordDefinition")

                    const addAdjacentElem = () => {
                        const newP = definitionP.insertAdjacentElement('beforeend', document.createElement("p"));
                        if (newP instanceof HTMLElement) {
                            const newPi = newP.appendChild(document.createElement("i"));
                            newPi.textContent = def.example;
                        }
                        definitionP.classList.add("example")
                    }
                    //check if key "example" is in definition. If it is, add the example to list
                    "example" in def ? addAdjacentElem() : true == true;
                });
            });
        });

        definitionDescriptionContainer.appendChild(definitionDescription);
        DictionaryWidget.previousWordsBtnWasClicked = false;
    }
}

const dictionaryWidget = {
    init: () => {
        const elem = (document.querySelector('.dictionaryWidget') as Element);

        // Create the dictionary widget, call create
        let dictionaryWidget = new DictionaryWidget();
        dictionaryWidget.createDictionaryWidget(elem);
    }
};

dictionaryWidget.init();