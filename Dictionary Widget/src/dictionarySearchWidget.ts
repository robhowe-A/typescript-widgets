//--Copyright (c) Robert A. Howell  May, 2023
import { DictionarySearchElements } from './widgetInterface'

/**
 * A DictionarySearchWidget is made to create Dictionary Search markup for the
 *  page display. Without markup, a search widget does not exist for user
 *  interaction.
 * 
 * Each public functions, the widget markup can be created in multiple site locations.
 *  All that is needed is a reference element for the widget's placement on
 *  the page.
 * 
 */
export default class DictionarySearchWidget {

    /**
     * Primary widget markup structuring the widget elements and search input.
     * 
     * @param elem - The reference element before the widget.
     * @returns searchElements: DictionarySearchElements --> interface of
     *  important HTML elements used through widget function.
     */
    public createDictionaryWidgetMarkup(elem: Element) {
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
                    let searchElements: DictionarySearchElements = {
                        searchWord: searchForm.appendChild(document.createElement("input")),
                        wordSearch: searchForm.appendChild(document.createElement("button")),
                        dictionaryElem: <HTMLElement>dictionary,
                        errorElem: searchForm.appendChild(document.createElement("span")),
                        previousWordBtn: previousWords.appendChild(document.createElement("button")),
                        refreshBtn: previousWords.appendChild(document.createElement("button")),
                    }
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
                console.log(`Add "dictionaryWidget" class to ${elem.nodeName} node.`)
            }
        }
        else {
            console.log(`There is no "dictionaryWidget" class on this page.`)
        }
    }

    /**
     * Creates the markup to house returned words from DictionarySearch. The markup
     *  is created based on API egress. Words and their definitions vary. The markup is
     *  adaptive to returned word data structures.
     * 
     * @param wordData - This parameter is an object of word types, definitions, and examples.
     * @param searchElems - Widget Elements -- used for data validation.
     */
    public createDictionaryTermWithMarkup(wordData: any, searchElems: DictionarySearchElements) {
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
        wordData.map((word: any) => {
            //console.log("The word is: ",word)
            const wordTitle = definitionDescription.appendChild(document.createElement("h3"));
            wordTitle.textContent = word.word;
            //Add the word and examples to page
            word.meanings.map((wordType: any) => {
                //console.log("WordType are: ", wordType)
                const wordTypeH = definitionDescription.appendChild(document.createElement("h4"));
                const wordTypeList = definitionDescription.appendChild(document.createElement("ul"));
                wordTypeH.textContent = wordType.partOfSpeech;
                wordType.definitions.map((def: any) => {
                    //console.log("Definition is: ", def);
                    let wordTypeDefItem = wordTypeList.appendChild(document.createElement("li"));
                    let definitionP = wordTypeDefItem.appendChild(document.createElement("p"));
                    definitionP.textContent = def.definition;
                    definitionP.classList.add("wordDefinition")

                    const addAdjacentElem = () => {
                        //console.log("Definitions is: ", def);
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
    }
}