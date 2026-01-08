//--Copyright (c) Robert A. Howell  May, 2023
import { ToDoListElements, localStorageToDoCache } from "./toDoWidgetInterface";

/**
 * A ToDoWidget is an HTML widget to store To-Dos in the browser. Instantiate the
 *  ToDoWidget constructor to create widget markup and functionality. To-Dos are
 *  stored in the browser's local storage and read and rendered when the page loads.
 * 
 * To create a ToDoWidget, an element on the page must have '.ToDoList' class. Call the
 *  class constructor, passing in that element to create the widget.
 *
 *       const todoWidget = new ToDoList();
 *       todoWidget.createToDoListWidget(elem);
 * 
 * Then, the widget is created and To-Dos are retrieved from storage.
 */
class ToDoWidget {
    public static todosInLocalStorage: boolean = false;
    public static toDos: number = 0;
    private static toDoElements: ToDoListElements;

    /**
     * A function to assign todolist elements internal:
     * 
     *      ToDoList.ToDoElements = ToDoListElements;
     * @param toDoListElements - important Widget Elements.
     */
    public static setToDoListElements(toDoListElements: ToDoListElements) {
        ToDoWidget.toDoElements = toDoListElements;
    }
    
    /**
     * Random Web Bits uses multiple locations to apply the To-Do List widget. Create
     *  the list markup, passing in a reference element for placement of the widget.
     * @param elem - widget is placed after this reference element.
     */
    public createToDoListWidget(elem: Element) {
        
        // Insert the widget after the passed in "elem"
        // Dependent on the page, todo widget may have pre-existing markup in place
        // Switch against the current page to determine markup needed
        if (elem !== undefined) {
            if (elem.classList.contains("ToDoList")) {
                // Create table elements needed for the todo list
                const TODOLISTSECTION = elem.insertAdjacentElement("beforeend", document.createElement("section"))!;
                const HEADER = TODOLISTSECTION.appendChild(document.createElement('h3'));
                const DIV = TODOLISTSECTION.appendChild(document.createElement('div'));
                const TABLE = DIV.appendChild(document.createElement('table'));
                const THEAD = TABLE.appendChild(document.createElement('thead'));
                const TR1 = THEAD.appendChild(document.createElement('tr'));
                const THLEFT = TR1.appendChild(document.createElement('th'));
                const THMIDDLE = TR1.appendChild(document.createElement('th'));
                const TBODY = TABLE.appendChild(document.createElement('tbody'));
                const TFOOT = TABLE.appendChild(document.createElement('tfoot'));
                const TR3 = TFOOT.appendChild(document.createElement('tr'));
                const TD3LEFT = TR3.appendChild(document.createElement('td'));
                const TD3IN = TD3LEFT.appendChild(document.createElement('input'));
                const TD3MIDDLE = TR3.appendChild(document.createElement('td'));
                const INPUT = TD3MIDDLE.appendChild(document.createElement('input'));

                // Add attributes and property values
                TABLE.appendChild(document.createElement('tfoot'));
                TD3IN.setAttribute("aria-label", "Add");
                TD3IN.setAttribute("Value", "Add");
                INPUT.setAttribute("name", "itemINPUT");
                INPUT.setAttribute("type", "text");
                INPUT.setAttribute("aria-label", "Input");
                HEADER.textContent = "To-Do:";
                TODOLISTSECTION.id = "ToDO";
                THLEFT.textContent = "Complete?";
                THMIDDLE.textContent = "Description";
                TBODY.id = "ToDoItems";
                TD3IN.id = "AddButton";
                TD3IN.type = "button";

                // Create a sample to do item (it is not stored in cache)
                this.createSampleTo_Do(TBODY);

                // With the elements created, set the class list elements
                let listElements:ToDoListElements = this.getToDoListElements();
                ToDoWidget.setToDoListElements(listElements);

                this.populateToDoList();
                this.addToDoEventListeners();
            }
            else{
                console.log("Element is not valid. Please ensure a valid element for ToDo list widget to follow.")
            }
        }
        else {
            console.log(`There is no "ToDoList" class on this page.`)
        }
    }

    /**
     * Gather necessary elements from the created widget.
     * @returns ToDoElements: ToDoListElements
     */
    private getToDoListElements() {
        let toDoElements: ToDoListElements = {
            toDoTable: (document.querySelector('#ToDO table') as HTMLTableElement),
            toDoTableBody: (document.getElementById('ToDoItems') as HTMLElement),
            addButton: (document.getElementById('AddButton') as HTMLElement),
            addItemToEnter: (document.querySelector('input[name="itemINPUT"]') as HTMLInputElement),
        }
        return toDoElements;
    }

    /**
     * Checks for To-Do items previously in storage.
     * @returns boolean true or false
     */
    private static isToDoInStorage() {
        if (localStorage.getItem('ToDos') != null){
            return true
        }
        return false
    }

    /**
     * Adds a To-Do string to Local Storage. The localStorageToDoCache interface
     *  structures the data for later retrieval.
     * @param description - User form input to add as a description.
     */
    private addtoDoToStorage(description: string) {
        // Use interface to structure the data in local storage
        let ToDo: localStorageToDoCache = {
            inCache: false,
            toDoItem: description,
        }
        let ToDos: any = [];
        ToDos.push(ToDo);
        //add the ToDos to local cache
        if (ToDoWidget.isToDoInStorage()){
            let todos: localStorageToDoCache[] = JSON.parse(localStorage.getItem('ToDos')!);
            todos.push(ToDo);
            localStorage.setItem('ToDos', JSON.stringify(todos));
        }
        else {
            localStorage.setItem('ToDos', JSON.stringify(ToDos));
            ToDoWidget.todosInLocalStorage = true;
        }
    }

    /**
     * Removes a To-Do item from Local Storage. The requested To-Do to remove is
     *  pulled individually from the key-value pair object.
     * @param item - the To-Do item requested to remove
     */
    private removeToDoFromStorage(item: string) {
        if (!ToDoWidget.isToDoInStorage()) {
            try {
                throw new Error("Local storage values null.");
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
            let todos: localStorageToDoCache[] = JSON.parse(localStorage.getItem('ToDos')!);
            todos = todos.filter((todo) => todo.toDoItem !== item);
            if (todos.length > 0)
                localStorage.setItem('ToDos', JSON.stringify(todos));
            else
                localStorage.removeItem('ToDos');
        }
    }

    /**
     * This function creates the necessary markup to add a row to the To-Do table.
     *  A row consists of three columns: a complete tick-box, a description, and a delete button.
     * @param description - User form input to add as a description.
     * @param firstPaint - Boolean value used by adding list storage
     */
    private addToDoRow(description: string, firstPaint: boolean) {
        //Create a table row with checkbox and delete options
        const TABLEITEM = ToDoWidget.toDoElements.toDoTable;
        if (TABLEITEM != null) {
            const TABLEFRAG = document.createDocumentFragment();
            const NEWROW = TABLEFRAG.appendChild(document.createElement('tr')); //Add row
            const FIRSTCOL = NEWROW.appendChild(document.createElement('td')); //Table first data
            const CHECKBOX = FIRSTCOL.appendChild(document.createElement('input')); //Add checkbox
            const NEWITEM = NEWROW.appendChild(document.createElement('td')); //Table second data
            const SECONDCOL = NEWROW.appendChild(document.createElement('td')); //Table third data
            const DELBOX = SECONDCOL.appendChild(document.createElement('input')) //Add deletebox

            // Add attributes and property values
            CHECKBOX.setAttribute('type', 'checkbox');
            CHECKBOX.setAttribute('aria-label', 'Checkbox');
            CHECKBOX.setAttribute('aria-label', 'Delete');
            NEWITEM.setAttribute('num', ToDoWidget.toDos ? (() => {
                let elem = document.querySelector('#ToDO td[num]');
                return ((Number(elem?.getAttribute("num")) || -1000) + ToDoWidget.toDos).toString();
            })() : (1).toString());
            NEWITEM.textContent = description.toString(); //Populate second col
            ToDoWidget.toDos++; //Number of Items
            DELBOX.setAttribute('type', 'submit');
            DELBOX.setAttribute('value', 'Delete');

            // Add the row to the ToDos table
            TABLEITEM.appendChild(TABLEFRAG);

            //add an event listener for when 'delete' is clicked
            DELBOX.addEventListener("click", () => { this.deleteButton(DELBOX); });

            if (firstPaint) {
                //add to list storage
                this.addtoDoToStorage(description);
            }
        }
        else {
            try {
                throw new Error("There were no 'ToDoItems' found or they are null.");
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.name);
                    console.log(error.message);
                    console.log(error.stack);
                }
            }
        }

    }

    /**
     * Function called to create the To-Do item rows from To-Dos stored in the browser Local Storage.
     */
    private populateToDoList() {
        //retrieve todo items in local storage and add each to the list
        if (ToDoWidget.isToDoInStorage()){
            let parsedToDos: localStorageToDoCache[] = JSON.parse(localStorage.getItem('ToDos')!);

            if (parsedToDos != null) {
                for (let i = 0; i < parsedToDos.length; i++) {
                    this.addToDoRow(parsedToDos[i].toDoItem, false);
                }
            }
        }
        else {
            try {
                throw new Error("There were no 'ToDoItems' found or they are null.");
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.name);
                    console.log(error.message);
                    console.log(error.stack);
                }
            }
        }
    }

    /**
     * Adds button functionality: Delete, Add.
     */
    private addToDoEventListeners() {
        const ADDBUTTON = ToDoWidget.toDoElements.addButton;
        const ADDITEMENTER = ToDoWidget.toDoElements.addItemToEnter;
        if (ADDBUTTON != null && ADDITEMENTER != null) {
            ADDBUTTON.addEventListener("click", () => {
                this.addToDoRow(ADDITEMENTER.value, true);
                ADDITEMENTER.value = '';
            });

            ADDITEMENTER.addEventListener("keydown", (e) => {
                if (e.code == 'NumpadEnter' || e.code == 'Enter') {
                    this.addToDoRow(ADDITEMENTER.value, true);
                    ADDITEMENTER.value = '';
                }
            });
        }
        else {
            try {
                throw new Error("Element was not found or is null");
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.name);
                    console.log(error.message);
                    console.log(error.stack);
                }
            }
        }
    }

    /**
     * function determining the delete button. Items are deleted when pushed, but are
     *  not removed from storage without 'Complete?' checkebox checked.
     * @param box checkbox element
     */
    private deleteButton(box: HTMLInputElement) {
        // When delete button is pressed, remove the respective row
        if (box.parentNode != null && box.parentNode.previousSibling != null &&
            box.parentNode.previousSibling.previousSibling != null) {

            let rowChkBx = <HTMLElement>box.parentNode.previousSibling.previousSibling;
            let rowChkBxIN = <HTMLInputElement>rowChkBx.childNodes[0];
            const todoTable: HTMLTableElement = ToDoWidget.toDoElements.toDoTable;
            if (todoTable != null) {
                let tr: HTMLTableRowElement = <HTMLTableRowElement>box.parentNode.parentNode;
                let i = tr.rowIndex;
                let value = box.parentNode.previousSibling.textContent;
                if (rowChkBxIN.checked) {
                    //remove row since completed
                    todoTable.deleteRow(i);

                    if (value != 'Add a ToDO Item.') {
                        ToDoWidget.toDos--;

                        //delete associated storage item
                        this.removeToDoFromStorage((value as string));
                    }
                }
                else {
                    // remove the row from the page
                    // if the checkbox isn't completed, the to-do will come back
                    todoTable.deleteRow(i);
                    ToDoWidget.toDos--;
                }
            }
            else {
                try {
                    throw new Error("'table' element not found or it is null.");
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.log(error.name);
                        console.log(error.message);
                        console.log(error.stack);
                    }
                }
            }
        }
    }

    /**
     * This function is called to seed the To-Do List when there are no Local Storage items
     *  which would populate the list. The sample remains on page but is never stored in the browser.
     * @param tBody table body element
     */
    private createSampleTo_Do(tBody: Element) {
        if (!ToDoWidget.isToDoInStorage()) {
            // Create a sample entry in the ToDo table as a placeholder
            const TR2 = tBody.appendChild(document.createElement('tr'));
            const TD2LEFT = TR2.appendChild(document.createElement('td'));
            const TD2IN = TD2LEFT.appendChild(document.createElement('input'));
            const TD2MIDDLE = TR2.appendChild(document.createElement('td'));
            const TD2RIGHT = TR2.appendChild(document.createElement('td'));
            const TD2DEL = TD2RIGHT.appendChild(document.createElement('input'));

            // Add attributes and property values
            TD2IN.setAttribute("aria-label", "Checkbox");
            TD2MIDDLE.setAttribute("num", `${1}`);
            TD2IN.setAttribute("aria-label", "Delete");
            TD2DEL.setAttribute("type", "reset");
            TD2DEL.setAttribute("value", "Delete");
            TD2IN.type = "checkbox";
            TD2MIDDLE.textContent = "Add a ToDO Item.";
            ToDoWidget.toDos++;

            //"delete" event listener
            TD2DEL.addEventListener("click", () => { this.deleteButton(TD2DEL) });
        }
    }
}

/**
 * Component containing the To-Do List widget's creation.
 */
const toDosWidget = {
    /**
     * Create a To-Do List widget.
     * @param elem - Element containing 'ToDoList' class
     */
    init: () => {
        // Locate the element for widget placement
        let elem = (document.querySelector(".ToDoList") as Element);

        // Create the to-do widget, call create
        const toDoWidget = new ToDoWidget();

        // Creates the markup needed and imports data from local storage, containing the todo items
        toDoWidget.createToDoListWidget(elem);
    }
};

toDosWidget.init();