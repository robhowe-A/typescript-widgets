# typescript-widgets

## Card Carousel Widget:

### A carousel/slideshow to display card elements

```HTML
<!-- Add widget to aside element -->
    <h1>Slideshow Widget (Below)</h1><hr>
      <div class="cardslideshow">
        <!-- card markup -->
        <!-- card markup -->
        <!-- card markup -->
        <!-- card markup -->
        <!-- card markup -->
        <!-- card markup -->
      </div>
    <aside class="ToDoList"></aside>
```

- Widget is seeded with 6 basic card elements
- Move the slideshow left or right using the arrow buttons
  > ```TypeScript
  > import CardSlideShow from "./CardSlideShow";
  > 
  > const CardsSlideShow = {
  >     init: () => {
  >      //creation, initialization, and functions for slideshow
  >     }
  >  }
  >  CardsSlideShow.init();
  > ```

-------------------
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
> ```