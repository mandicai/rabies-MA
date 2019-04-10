# So...is rabies alive in MA?
#### Demo: https://mandicai.github.io/rabies-MA/

## Intro
I was nipped by a cat & got curious about the state of rabies in Massachusetts (for my own wellbeing). Data is from the [Mass.gov website](https://www.mass.gov/lists/rabies-surveillance-data).

## How it works
Visualizations made in D3, scrolly story created with the help of [Scrollama](https://github.com/russellgoldenberg/scrollama) & [this article](https://pudding.cool/process/scrollytelling-sticky/) about using `position:sticky`.

## Run it
To run, `git clone` the repo, `cd` into the project, and run `http-server -c-1 -p 8000` (or any local server of your choice) to view the project at `localhost:8000`.

## Sources
[Mass.gov: Rabies surveillance data](https://www.mass.gov/lists/rabies-surveillance-data)
[Mass.gov: Rabies Clinics](https://www.mass.gov/service-details/rabies-clinics)
[Mass.gov: Learn about foxes](https://www.mass.gov/service-details/learn-about-foxes)
[Mass.gov: Bats of Massachusetts](https://www.mass.gov/service-details/bats-of-massachusetts)

## Resources
Creating the charts:
- Stream graphs:
  - https://observablehq.com/@mbostock/streamgraph-transitions
  - https://bl.ocks.org/john-guerra/f898333fb41d69978945d315e7b7980c
- Slope graphs:
  - https://bl.ocks.org/tlfrd/042b2318c8767bad7a485098fbf760fc

Choosing the color palette:
- https://projects.susielu.com/viz-palette
- https://cloudflare.design/color/

Creating the scrolly story
- https://pudding.cool/process/introducing-scrollama/
- https://pudding.cool/process/scrollytelling-sticky/

Creating the maps
- https://docs.mapbox.com/mapbox-gl-js/example/simple-map/
- https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
