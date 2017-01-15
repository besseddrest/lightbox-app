// sets up main DOM elements then fetches data for the app
class App {
  constructor() {
    this.page = 1;

    // create main DOM elements
    const container = document.querySelector('.container'),
          gallery = document.createElement('section');
    gallery.classList.add('gallery');
    container.appendChild(gallery);

    this.getData(this.page);
  }

  // setupListeners() {
  //   const prev = document.querySelector('.button__prev'),
  //         next = document.querySelector('.button__next');
  //
  //   prev.addEventListener('click', () => {
  //     this.page -= 1;
  //     this.getData(this.page);
  //   });
  //   next.addEventListener('click', () => {
  //     this.page += 1;
  //     this.getData(this.page);
  //   });
  // }

  getData(startPage) {
    // new request to Flickr API
    // endpoint: flickr.photosets.getPhotos
    const flickrRequest = new XMLHttpRequest();

    // query params
    const method = 'method=flickr.photosets.getPhotos',
          apiKey = 'api_key=80b5e262669dbc694b3675cc0ca4e9e2',
          photosetId = 'photoset_id=72157656631414494',
          userId = 'user_id=25674596@N02',
          format = 'format=json',
          noCallback = 'nojsoncallback=?';

    flickrRequest.open('GET', `https://api.flickr.com/services/rest/?${method}&${apiKey}&${photosetId}&${userId}&${format}&${noCallback}`);

    flickrRequest.onload = function() {
      if (flickrRequest.status >= 200 && flickrRequest.status < 400) {
        const response = JSON.parse(flickrRequest.responseText),
              gallery = new Gallery(response),
              viewport = new Viewport();
      } else {
        console.log('err');
      }
    }

    flickrRequest.send();
  }
}

class Gallery {
  constructor(data) {
    console.log(data);
    this.data = data;
    this.count = this.data.photoset.photo.length;

    this.renderThumbs();
    this.setupListeners();
  }

  renderThumbs() {
    // creates new instance of Thumb for each photo
    const photos = this.data.photoset.photo;

    photos.forEach((photo, i) => {
      const thumb = new Thumb(photo, i);
    });
  }

  setupListeners() {
    // listen for left and right arrow keys
    addEventListener('keydown', (e) => {
      // proceed only if the user has selected an image already
      if (this.active >= 0)
        this.checkKey(e)
    });
  }

  checkKey(e) {
    const active = this.active;
    const photos = this.data.photoset.photo;

    if (e.keyCode == 37 && active > 0) {
      // if left arrow, set previous as active
      Gallery.prototype.setActive(photos[active - 1], active - 1);
    } else if (e.keyCode == 39 && active < (this.count - 1)) {
      // if right arrow, set next as active
      Gallery.prototype.setActive(photos[active + 1], active + 1);
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
    // set active photo
    Gallery.prototype.setActive(photo, this.key);
  }
}

// takes photo obj and updates or creates image in viewport
class Viewport {
  constructor(obj) {
    this.photo = {};

    const viewport = document.createElement('section');
    viewport.classList.add('viewport');

    const container = document.querySelector('.container');
    container.appendChild(viewport);
  }

  update(obj) {
    let image, title;
    const viewport = document.querySelector('.viewport'),
          src = `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_b.jpg`;

    if (typeof this.photo == 'undefined') {
      // create the first active image in the viewport
      image = document.createElement('img');
      image.classList.add('viewport--image');
      image.src = src;
      viewport.appendChild(image);

      title = document.createElement('h2');
      title.classList.add('viewport--img-title');
      title.innerHTML = obj.title;
      viewport.appendChild(title);
    } else {
      // just change the existing src value
      image = document.querySelector('.viewport--image');
      image.src = src;
      title = document.querySelector('.viewport--img-title').innerHTML = obj.title;
    }


    this.photo = obj;
  }
}

// create new instance of app
const app = new App();
