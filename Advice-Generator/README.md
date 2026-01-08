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

# Project initialization:

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

> ```shell
> #1. Within the project's folder and run the below (2) dependency installation
> - Next.js
> - React-dom
> npm install next@13 react@latest react-dom@latest
>
> #2. Start environment.
> npm run dev
>
> #3. After started, the console output offers http://localhost:3000. CTRL + Click to open the project
> ```
