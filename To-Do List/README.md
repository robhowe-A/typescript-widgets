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

---

# Project initialization:

> ```shell
> #1. Within the project's folder and run the below (4) dependency installations
> # They install gulp-cli, gulp with typescript, browserify, tsify,
> # vinyl-source-stream, and watchify  dependencies needed to run
> # the developer's environment
> #
> #Node.JS commands to bring up the development
> npm install -g gulp-cli
>
> npm install --save-dev typescript gulp@4.0.0 gulp-typescript
>
> npm install --save-dev browserify tsify vinyl-source-stream
>
> npm install --save-dev watchify fancy-log
>
> #2. Once they're ready, run the below command to begin
> gulp
>
> #3. Launch either with Live Server extension or web server of your choice.
> #4 (Live Server extension). Extension: Live Server for launch instructions...
> #
> #The widget markup source is in the dist folder. The URL may look like "http://127.0.0.1:5500/"
> ```
