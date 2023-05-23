# typescript-widgets
## Dictionary Widget:  

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
```  

<details>
<summary>Details:</summary>  

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

<details>
<summary>Details:</summary>  

- Exportable widget based on classname

``` HTML
<!-- Add widget to aside element -->
<h1>To Do List Widget (Below)</h1><hr>
<aside class="ToDoList"></aside>
```

</details>

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

## Advice Generator:  
### FrontEnd Mentor challenge web component displaying colloquial advice expressions  

- View the optimal layout for the app depending on their device's screen size (in development: phase 1)
- See hover states for all interactive elements on the page (in development: phase 2)
- Generate a new piece of advice by clicking the dice icon

```JavaScript
function fetchAdvice() {
  let dataPromise = new Promise<adviceData>((resolve, reject) => {
    resolve(apiGET());
    reject(new Error("Promise rejected."));
  })
  dataPromise
    .then((data) => {
    let returnedAdvice: adviceData = data;
    returnedAdvice = checkDataStringChangeNeeds(returnedAdvice);
    setData(returnedAdvice);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
    setError(error);
  })
  .finally(() => {
    setLoading(false);
  });
}
```
