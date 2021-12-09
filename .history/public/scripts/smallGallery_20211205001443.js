
// Codegrid
// Responsive Image Slider | LoryJS | HTML, CSS & JavaScript
// https://www.youtube.com/watch?v=GFcnxlNnC8w
"use strict";

    var lory = require('lory.js').lory;


let slider = document.querySelector('.js-carousel');

lory(slider, {
  infinite: 1,
  enableMouseEvents: true,
  classNameFrame: 'js-carousel__frame',
  classNameSlideContainer: 'js-carousel__slides',
  classNamePrevCtrl: 'js-carousel__prev',
  classNameNextCtrl: 'js-carousel__next',
});