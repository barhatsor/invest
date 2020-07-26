/* app.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.0;

// Header effects on scroll
var hero = document.querySelector('.hero');

window.addEventListener('scroll', function(e) {
   if (window.scrollY > hero.clientHeight) {
      document.querySelector('.header').style.background = '#111';
      document.querySelector('.header').style.boxShadow = 'inset 0 -1px 0 0 rgb(255 255 255 / 0.24)';
   }
   else {
      document.querySelector('.header').style.background = 'transparent';
      document.querySelector('.header').style.boxShadow = 'none';
   }
})
