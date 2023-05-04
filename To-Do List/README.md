# typescript-widgets

## To-Do List Widget:

### A todo list in a webpage, from stored entries

- Add to-dos using an input form
- Delete entries if 'complete' checkbox is entered
- Store to-dos in browser storage --> re-render on page reload
- Exportable widget based on classname

```HTML
<!-- Add widget to aside element -->
<h1>To Do List Widget (Below)</h1><hr>
<aside class="ToDoList"></aside>
```

- Cached word entries in **local storage**

  > ```TypeScript
  > if (ToDoWidget.isToDoInStorage()){
  >    let todos: localstoragetodocache[] = JSON.parse(localStorage.getItem('ToDos')!);
  >    todos.push(ToDo);
  >    localStorage.setItem('ToDos', JSON.stringify(todos));
  > }
  > ```

- Widget is seeded with a default value, never stored in cache
- Removing an item requires the checkbox
  > ```TypeScript
  > if (rowChkBxIN.checked) {
  >    //remove row since completed
  >    todoTable.deleteRow(i);
  >
  >    if (value != 'Add a ToDO Item.') {
  >       ToDoWidget.ToDOs--;
  >
  >       //delete associated storage item
  >       this.removetoDoFromStorage((value as string));
  >    }
  > }
  > ```
