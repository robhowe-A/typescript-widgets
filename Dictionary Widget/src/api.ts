//--Copyright (c) Robert A. Howell  May, 2023

/**
 * ApiGet is for fetch requests. Use an ApiGet object to manipulate the fetch
 *  request into either:
 * 
 * 1. returning data 
 * 
 * --or --
 * 
 * 2. storing the request in the browser cache to retrieve later
 */
export class ApiGet {
    public errorElem: HTMLElement;
    private getUrl: URL;
    private sendToBrowserCache: boolean = false;
    private browserCacheName: string;

    /**
     * This constructor gathers all the needed information for fetch and/or browser
     *  storage.
     * 
     * @param getUrl - the (full) url of data request.
     * @param sendToBrowserCache  - Boolean value determining fetch caching.
     * @param browserCacheName - If storing the request in browser cache, this string provides the name for storage.
     * @param errorElem - Should the fetch request fail, return error status to this element.
     */
    constructor(getUrl: URL, sendToBrowserCache: boolean, errorElem: HTMLElement, browserCacheName: string | null) {
        this.getUrl = getUrl;
        this.sendToBrowserCache = sendToBrowserCache;
        this.browserCacheName = browserCacheName;
        this.errorElem = errorElem;
    }

    /**
     * 
     * @returns this.sendToBrowserCache
     */
    public getSendToBrowserCache() {
        return this.sendToBrowserCache;
    }

    /**
     * 
     * @returns this.GETURL
     */
    public getGetUrl() {
        return this.getUrl;
    };

    /**
     * Flip this.sendToBrowserCache boolean value from the current value.
     */
    public setSendToBrowserCache() {
        return this.sendToBrowserCache ? false : true;
    }

    /**
     * A fetch request can take URL or string parameter. This function sets the apiGET
     *  object for a URL fetch by creating a URL from the string, or passing the URL.
     * @param getUrl - the (full) url of data request. 
     */
    public setGetUrl(getUrl: URL | string) {
        if (typeof getUrl === 'string'){
            this.getUrl = new URL(getUrl);
        }
        else {
            this.getUrl = getUrl;
        }
    }

    /**
     * Checks whether the requested response is of valid status 'OK' and '200'
     * @param res - the fetched response.
     * @returns - returns res.json() on success or returns response on failure.
     */
    private apiResponseErrorCheck(res: Response) {
        if (res.status == 404){
            this.errorElem.classList.add("error");
            this.errorElem.innerText = "404 fetch error!";
            return res;
        }
        if (!res.ok || res.status != 200) {
            throw new Error(res.ok + ": " + res.status);
        }

        return res.json();
    }

    /**
     * The fetch request, returning a fetch promise.
     * @param getUrl - the (full) url of data request.
     * @returns data.text() or data based on the instance returned.
     */
    private fetchData(getUrl: URL) {
        return fetch(getUrl)
                .then((response) => this.apiResponseErrorCheck(response))
                .then((data) => {
                    if (data instanceof Response){
                        return data.text();
                    }
                    else return data;
                })
                .catch((e: any) => {
                        console.log(e);
                        this.errorElem.classList.add("error");
                        this.errorElem.innerText = `${e.message}`;
                });
        }

    /**
     * A public function, creating a data promise object for the called fetch function. If
     *  the request needs added to browser storage, the fetch is made and sent to
     *  storage. A cloned copy of the fetched data is returned. Without sending to
     *  browser cache, the fetch is requested and returned.
     * @param getUrl - the (full) url of data request.
     * @returns dataCachePromise: Promise<unknown>
     */
    public async apiGET(getUrl: URL) {
        if (this.sendToBrowserCache){
            let dataCachePromise = new Promise((resolve, reject)=> {
                if ('caches' in window) {
                    // Open cache and check for request existing in Cache Storage
                    window.caches.open(this.browserCacheName).then((cache) => {
                        caches.match(getUrl).then((result)=>{
                            if (result === undefined){
                                // Fetch the request normally
                                fetch(getUrl).then((result) => {
                                    // Make a copy of the response since it can only be read once
                                    let clonedresp = result.clone();
        
                                    // Add the result to the cache
                                    cache.put(getUrl, result);
                                    console.log("Word cached to cache storage.")
                                    resolve(clonedresp.json().then((text) => text));
                                })
                            }
                            else {
                                console.log("Word search response retrieved from cache storage.")
                                resolve(result.json().then((text) => text));
                            }
                        })
                    })
                }
            })
            dataCachePromise.then( (response:any)  => {
                return response;
            });
            return dataCachePromise;
        }
        else {
            let dataPromise = new Promise((resolve, reject)=> {
                resolve(this.fetchData(getUrl))
            })
            dataPromise.then((data) => {
                return data;
            })
            console.log("Word search response retrieved via fetch.")
            return dataPromise;
        }
    }
}