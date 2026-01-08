//--Copyright (c) Robert A. Howell  May, 2023
import { DictionarySearch } from './dictionarySearch'

/**
 * Component containing the dictionary widget's creation.
 */
const dictionaryWidget = {
    /**
     * This initialization function creates a dictionary search widget by calling the
     *  constructor.
     */
    init: () => {
        // Locate the element for widget placement
        const elem = (document.querySelector('.dictionaryWidget') as Element);

        // DictionarySearch constructor
        new DictionarySearch(elem);
    }
};

dictionaryWidget.init();