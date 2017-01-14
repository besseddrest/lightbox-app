// sets up main DOM elements
class App {
  constructor() {
    console.log('app');
  }
}

class Gallery {
  // makes API call
  // each image result creates new instance of thumb

  // listens for key press or click
  // - left keypress = prev
  // - right keypress = next
  // - click = make active

  // move
  // - get current index
  // - move to next or previous index
  // - make that index active
  constructor() {
    console.log('gallery');
  }

  getData() {

  }

  updateViewport() {

  }
}

// takes image ID value and displays image
class Viewport {
  constructor(img) {
    console.log('Viewport');
  }

  displayImage() {

  }
}

class Thumb {
  // constructor init with ID?
  // onClick ID gets passed to Gallery
  // find that ID in the 'gallery'
  // - with the ID we have a point where we can move prev or next
  // gallery should pass ID to viewport
  constructor() {
    console.log('thumb');
  }

  handleClick() {

  }
}

const app = new App();
