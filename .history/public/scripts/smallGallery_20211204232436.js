
// Codegrid
// Responsive Image Slider | LoryJS | HTML, CSS & JavaScript
// https://www.youtube.com/watch?v=GFcnxlNnC8w

import { lory } from 'lory.js';
let slider = document.querySelector('.js-carousel');
console.log("ok ok asa");
lory(slider, {
  infinite: 1,
  enableMouseEvents: true,
  classNameFrame: 'js-carousel__frame',
  classNameSlideContainer: 'js-carousel__slides',
  classNamePrevCtrl: 'js-carousel__prev',
  classNameNextCtrl: 'js-carousel__next',
});