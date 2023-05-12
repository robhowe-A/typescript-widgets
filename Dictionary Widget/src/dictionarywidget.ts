//--Copyright (c) Robert A. Howell  May, 2023

import { DictionarySearch } from './DictionarySearch'


const dictionaryWidget = {
    init: () => {
        const elem = (document.querySelector('.dictionaryWidget') as Element);

        // Create the dictionary widget, call create
        new DictionarySearch(elem);
    }
};

dictionaryWidget.init();