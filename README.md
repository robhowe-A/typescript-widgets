# typescript-widgets

## Dictionary Widget:  
### Search box word entry and definition retrieval
   - Retrieve words from a word dictionary API.
   - Asynchronous word fetch
   - Dynamic markup creation

~~~ TypeScript
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
   
~~~

   - Cached word entries in **local storage**
      > ~~~ TypeScript
      > private addDictionaryTermtoLocalStorage(sendToBrowserCache: boolean, wordcache: localstoragewordcache, wordArray: any[],)
      > ~~~  

   - Cached responses (for offline use) in **cache storage**
      > ~~~ TypeScript
      > //set apiGET::sendToBrowserCache to true to use cache storage
      >    const wordFetch = new apiGET(wordcache.wordURL, true, wordcache.cacheName, elem.errorElem);
      > ~~~  

   - <u>Input validation</u> with <u>interactive feedback</u>:  
     <span style="color: red">"Invalid word!"</span>  
     <span style="color: yellow">"No Definitions Found"</span>  
     <span style="color: red">"Failed to fetch, check network connection."</span>  
