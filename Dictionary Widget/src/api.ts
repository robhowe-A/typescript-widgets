//--Copyright (c) Robert A. Howell  May, 2023

export class apiGET {
    private GETURL: URL;
    private sendToBrowserCache: boolean = false;
    private browserCacheName: string;
    public errorElem: HTMLElement;
    
    constructor(GETURL: URL, sendToBrowserCache: boolean, browserCacheName: string, errorElem: HTMLElement) {
        this.GETURL = GETURL;
        this.sendToBrowserCache = sendToBrowserCache;
        this.browserCacheName = browserCacheName;
        this.errorElem = errorElem;
    }

    public getSendToBrowserCache() {
        return this.sendToBrowserCache;
    }

    public getGETURL() {
        return this.GETURL;
    };

    public setSendToBrowserCache() {
        return this.sendToBrowserCache ? false : true;
    }

    public setGETURL(GETURL: URL | string) {
        if (typeof GETURL === 'string'){
            this.GETURL = new URL(GETURL);
        }
        else {
            this.GETURL = GETURL;
        }
    }

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

    private fetchData(GETURL: URL) {
        return fetch(GETURL)
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
        
    public async apiGET(GETURL: URL) {
        if (this.sendToBrowserCache){
            let dataCachePromise = new Promise((resolve, reject)=> {
                if ('caches' in window) {
                    // Open cache and check for request existing in Cache Storage
                    window.caches.open(this.browserCacheName).then((cache) => {
                        caches.match(GETURL).then((result)=>{
                            if (result === undefined){
                                // Fetch the request normally
                                fetch(GETURL).then((result) => {
                                    // Make a copy of the response since it can only be read once
                                    let clonedresp = result.clone();
        
                                    // Add the result to the cache
                                    cache.put(GETURL, result);
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
                resolve(this.fetchData(GETURL))
            })
            dataPromise.then((data) => {
                return data;
            })
            console.log("Word search response retrieved via fetch.")
            return dataPromise;
        }
    }
}