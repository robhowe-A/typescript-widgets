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
