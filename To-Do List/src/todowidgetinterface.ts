//--Copyright (c) Robert A. Howell  May, 2023

/**
 * Interface used for To-Do List elements functionality.
 */
export interface ToDoListElements {
    todoTable: HTMLTableElement,
    todoTableBody: HTMLElement;
    addButton: HTMLElement;
    addItemToEnter: HTMLInputElement;
}

/**
 * Interface used for Local Storage key-value dictionary words
 */
export interface localstoragetodocache {
    inCache: boolean,
    todoitem: string,
}