//--Copyright (c) Robert A. Howell  May, 2023
/**
 * Interface used for DictionarySearch Elements functionality.
 */
export interface DictionarySearchElements {
    searchWord: HTMLInputElement;
    wordSearch: HTMLButtonElement;
    dictionaryElem: HTMLElement;
    errorElem: HTMLSpanElement;
    previousWordBtn: HTMLButtonElement;
    refreshBtn: HTMLButtonElement;
}

/**
 * Interface used for Local Storage key-value dictionary words
 */
export interface localstoragewordvalue {
    inCache: boolean,
    word: string,
    wordURL: URL,
    cacheName: string,
}