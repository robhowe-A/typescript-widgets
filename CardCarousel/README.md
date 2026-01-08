# typescript-widgets

## Card Carousel Widget:

**What is it?**

A web component made for www.randomwebbits.com. It's a picture carousel and/or slideshow

<img src="../CardSlideshow.png" alt="A slideshow widget." width="70%">

**What does it do?**

- Interactive due to newly created elements and functions that are not availablle in the original markup
- JavaScript adds new elements to make the component function as expected
- Two slides show at a time, one on the left and one on the right
- The 'SlideShow' is a class with members and functions capable of running the slideshow

**Technology?**

- Built with Gulp + TypeScript compiler
- Javascript async module
- HTML markup and JavaScript


### Markup & Description

```HTML
    <h1>Slideshow Widget (Below)</h1><hr>
    <div class="cardslideshow">
      <!-- card markup -->
      <!-- card markup -->
      <!-- card markup -->
      <!-- card markup -->
      <!-- card markup -->
      <!-- card markup -->
    </div>
```

- Widget is seeded with 6 basic card elements
- Move the slideshow left or right using the arrow buttons
- The slideshow runs via custom modules. The entry point is CardsSlideShow.init().
  > ```TypeScript
  > import SlideShow from "./CardSlideShow";
  >
  > const CardsSlideShow = {
  >     init: () => {
  >      //markup creation and slideshow initialization
  >     }
  >  }
  >  CardsSlideShow.init();
  > ```

---

# Project initialization:

> ``` shell
> #Prerequisites
> - Node.js installation: Below install link
> - PowerShell execution policy enabled
> 
> #Administrator: Windows PowerShell (Windows)
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
> 
> ## Recommended developer environment software: VS Code: Below install link
> ```
> [Install jodejs](https://nodejs.org/en)
> [Install Visual Studio Code](https://code.visualstudio.com/download)
> ```
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
> #The widget markup source is /dist/index.html, so the URL may look like "http://127.0.0.1:5500/dist/index.html"
> ```
