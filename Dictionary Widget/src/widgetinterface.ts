//--Copyright (c) Robert A. Howell  May, 2023
export interface DictionarySearchElements {
    searchWord: HTMLInputElement;
    wordSearch: HTMLButtonElement;
    dictionaryElem: HTMLElement;
    errorElem: HTMLSpanElement;
    previousWordBtn: HTMLButtonElement;
    refreshBtn: HTMLButtonElement;
}

export interface localstoragewordvalue {
    inCache: boolean,
    word: string,
    wordURL: URL,
    cacheName: string,
}