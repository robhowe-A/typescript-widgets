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
//--Copyright (c) Robert A. Howell  May, 2023
import { adviceData } from "./adviceData";

export function checkDataStringChangeNeeds(data: adviceData) {
    //slip advice ingress checks
    switch(data.slip.id){
      case 22:
      case 48:
      case 67:
      case 203:
        // request is missing id, advice slip
        data.slip.id = 22;
        data.slip.advice = "Empty advice, please reload.";
      case 29:
        data.slip.advice = "As you get older, learn never to trust a f**t.";
      case 33:
        data.slip.advice = "Don't let the b******s grind you down.";
      case 34:
        data.slip.advice = "To improve productivity, always have a s******r task to put off.";
      case 76:
        // string characters are unreadable --> use \u00e4
        data.slip.advice =  "You will always regret the round of J\u00e4germeister.";
      case 80:
        data.slip.advice = "Opinions are like arse****s, everyone has one.";
      case 111:
        data.slip.advice = "You're not as f*t as you think you are.";
      case 114:
        data.slip.advice = "Step 1. Give a s**t. Step 2. Don't be a d**k. Step 3. Know when to let go.";
      case 131:
        data.slip.advice = "You only live once.";
      case 146:
        data.slip.advice = "Today, do not use the words 'Kind of,' 'Sort of' or 'Maybe.' It either is or it isn't.";
      case 181:
        data.slip.advice = "Rule number 1: Try not to die. Rule number 2: Don't be a d**k.";
      break;
    }
    return data;
  }
```
