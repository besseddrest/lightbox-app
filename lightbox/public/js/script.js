// sets up main DOM elements then fetches data for the app
class App {
  constructor() {
    this.renderElements();
    this.getData(this.page);
  }

  renderElements() {
    // create main DOM elements
    const container = document.querySelector('.container'),
          gallery = document.createElement('section');

    gallery.classList.add('gallery');
    container.appendChild(gallery);
  }

  getData() {
    // query params
    const method = 'method=flickr.photosets.getPhotos',
          apiKey = 'api_key=80b5e262669dbc694b3675cc0ca4e9e2',
          photosetId = 'photoset_id=72157659012153010',
          userId = 'user_id=25674596@N02',
          format = 'format=json',
          noCallback = 'nojsoncallback=?';

    // request to Flickr API, endpoint: flickr.photosets.getPhotos
    const flickrRequest = new XMLHttpRequest();

    flickrRequest.open('GET', `https://api.flickr.com/services/rest/?${method}&${apiKey}&${photosetId}&${userId}&${format}&${noCallback}`);

    flickrRequest.onload = function() {
      // create gallery & viewport on success
      if (flickrRequest.status >= 200 && flickrRequest.status < 400) {
        const response = JSON.parse(flickrRequest.responseText),
              gallery = new Gallery(response),
              viewport = new Viewport();
      } else {
        console.log('Request failed.');
      }
    }

    flickrRequest.onerror = function() {
      console.log('Failed due to an error.');
    }

    flickrRequest.send();
  }
}

class Gallery {
  constructor(data) {
    this.data = data;
    this.photos = data.photoset.photo;
    this.count = data.photoset.photo.length;

    this.renderElements();
    this.setupListeners();
  }

  renderElements() {
    this.renderTitle();
    this.renderThumbs();
  }

  renderTitle() {
    // render photoset title
    const photosetTitle = document.querySelector('.photoset--title');
    photosetTitle.innerHTML = this.data.photoset.title;
  }

  renderThumbs() {
    // creates new instance of Thumb for each photo
    const photos = this.photos;

    photos.forEach((photo, i) => {
      const thumb = new Thumb(photo, i);
    });

    this.displayGallery();
  }

  displayGallery() {
    // fade in the gallery after thumbs are created
    const gallery = document.querySelector('.gallery');
    gallery.classList.add('gallery__visible');
  }

  setupListeners() {
    // listen for arrow keys
    addEventListener('keydown', (e) => {
      // proceed only if the user has selected an image already
      if (this.active >= 0)
        this.checkKey(e)
    });
  }

  checkKey(e) {
    // updates key based on arrow key press
    let active = this.active;
    const photos = this.photos;

    switch (e.code) {
      case 'ArrowLeft':
        active -= 1;
        break;
      case 'ArrowRight':
        active += 1;
        break;
      case 'ArrowUp':
        active -= 5;
        break;
      case 'ArrowDown':
        active += 5;
        break;
      default:
        // only proceed on arrow keys
        return;
    }

    // set new active photo if new key within range
    if (active >= 0 && active <= (this.count - 1)) {
      Gallery.prototype.setActive(photos[active], active);
    }
  }

  setActive(obj, key) {
    if (key >= 0)
      this.active = key;

    // use the key to find the active DOM element and modify classes
    const prevActive = document.querySelector('.gallery--image__active'),
          images = document.querySelectorAll('img');

    if (prevActive)
      prevActive.classList.remove('gallery--image__active');

    images[this.active].classList.add('gallery--image__active');

    // update Viewport with new photo obj
    Viewport.prototype.update(obj);
  }
}

class Thumb {
  constructor(photo, i) {
    this.photo = photo;
    this.key = i;
    this.url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;

    this.renderThumb();
  }

  renderThumb() {
    // create new image element and append to gallery
    const gallery = document.querySelector('.gallery'),
          thumb = document.createElement('img');

    thumb.classList.add('gallery--image');
    thumb.src = this.url;
    thumb.addEventListener('click', () => this.handleClick(this.photo));

    gallery.appendChild(thumb);
  }

  handleClick(photo) {
    // don't do anything if user clicks active photo
    if (this.key == Gallery.prototype.active)
      return;

    // delete the placeholder element
    const placeholder = document.querySelector('.viewport--placeholder');
    if (placeholder) {
      const parent = placeholder.parentNode;
      parent.removeChild(placeholder);
    }

    // set active photo
    Gallery.prototype.setActive(photo, this.key);
  }
}

// takes photo obj and updates or creates image in viewport
class Viewport {
  constructor(obj) {
    this.photo = {};

    this.createViewportElements();
  }

  createViewportElements() {
    const viewport = document.createElement('section');
    viewport.classList.add('viewport');

    const placeholder = document.createElement('h1');
    placeholder.classList.add('viewport--placeholder');
    placeholder.innerHTML = "Select a thumbnail";
    viewport.appendChild(placeholder);

    const image = document.createElement('div');
    image.classList.add('viewport--image');
    viewport.appendChild(image);

    const container = document.querySelector('.container');
    container.appendChild(viewport);
  }

  update(obj) {
    // deletes and creats new photo & title elements, allows us to use CSS animations
    const wrapper = document.querySelector('.viewport--image'),
          src = `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_b.jpg`;

    // remove the previous photo and title element
    const prevPhoto = document.querySelector('.viewport--photo');
    const prevTitle = document.querySelector('.viewport--photo-title-wrapper');
    if (prevPhoto) {
      wrapper.removeChild(prevPhoto);
      wrapper.removeChild(prevTitle);
    }

    // create a new photo element
    const photo = document.createElement('img');
    photo.classList.add('viewport--photo');
    photo.src = src;
    wrapper.appendChild(photo);

    // delay the title creation so the image can load
    setTimeout(function(){
      const title = document.createElement('div');
      title.classList.add('viewport--photo-title-wrapper');
      title.innerHTML = `<div class="viewport--photo-title">${obj.title}</div>`;
      wrapper.appendChild(title);
    }, 50);

    // update current photo in registry
    this.photo = obj;
  }
}

// create new instance of app
const app = new App();
