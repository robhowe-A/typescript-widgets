//--Copyright (c) Robert A. Howell  May, 2023
export interface ToDoListElements {
    todoTable: HTMLTableElement,
    todoTableBody: HTMLElement;
    addButton: HTMLElement;
    addItemToEnter: HTMLInputElement;
}

export interface localstoragetodocache {
    inCache: boolean,
    todoitem: string,
}