# typescript-widgets
<<<<<<< HEAD
<details>
<summary>Dictionary Widget:</summary>  
## Dictionary Widget:  

=======

## Dictionary Widget:  


>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094
### Search box word entry and definition retrieval

- Retrieve words from a word dictionary API.
- Asynchronous word fetch
- Dynamic markup creation

```TypeScript
const wordFetchRequest = async () => {
   //(alias) new apiGET(GETURL: URL, sendToBrowserCache: boolean, browserCacheName: string, errorElem: HTMLElement): apiGET
   //import apiGET
   //
   //set apiGET::sendToBrowserCache to true to use cache storage
   const wordFetch = new apiGET(wordcache.wordURL, false, wordcache.cacheName, elem.errorElem);

   //fetch request
   let data = await wordFetch.apiGET(wordFetch.getGETURL());

   //data parse and markup render
   //...continued code...//
};
wordFetchRequest();

<<<<<<< HEAD
```
=======
```  

<details>
<summary>Dictionary Widget:</summary>  
>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094

- Cached word entries in **local storage**

  > ```TypeScript
  > private addDictionaryTermtoLocalStorage(sendToBrowserCache: boolean, wordcache: localstoragewordcache, wordArray: any[],)
  > ```

- Cached responses (for offline use) in **cache storage**

  > ```TypeScript
  > //set apiGET::sendToBrowserCache to true to use cache storage
  >    const wordFetch = new apiGET(wordcache.wordURL, true, wordcache.cacheName, elem.errorElem);
  > ```

- <u>Input validation</u> with <u>interactive feedback</u>:  
  <span style="color: red">"Invalid word!"</span>  
  <span style="color: yellow">"No Definitions Found"</span>  
  <span style="color: red">"Failed to fetch, check network connection."</span>

</details>

<<<<<<< HEAD
<details>
<summary>To-Do List Widget:</summary>  
=======
>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094
## To-Do List Widget:  

### A todo list in a webpage, from stored entries

- Add to-dos using an input form
- Delete entries if 'complete' checkbox is entered
- Store to-dos in browser storage --> re-render on page reload
<<<<<<< HEAD
- Exportable widget based on classname

```HTML
<!-- Add widget to aside element -->
<h1>To Do List Widget (Below)</h1><hr>
<aside class="ToDoList"></aside>
```

=======
>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094
- Cached word entries in **local storage**

  > ```TypeScript
  > if (ToDoWidget.isToDoInStorage()){
  >    let todos: localstoragetodocache[] = JSON.parse(localStorage.getItem('ToDos')!);
  >    todos.push(ToDo);
  >    localStorage.setItem('ToDos', JSON.stringify(todos));
  > }
  > ```

<<<<<<< HEAD
=======

<details>
<summary>To-Do List Widget:</summary>  

- Exportable widget based on classname

```HTML
<!-- Add widget to aside element -->
<h1>To Do List Widget (Below)</h1><hr>
<aside class="ToDoList"></aside>

>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094
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

<<<<<<< HEAD
</details>
=======
</details>


>>>>>>> cfacf8e9c839cb20d364568099f9b6d9eac5f094
