/* app.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.1;
const $ = document.querySelector.bind(document);

// Header effects on scroll
var header = $('.header');
var hero = $('.hero');

window.addEventListener('scroll', function(e) {
   // Window scroll position
   var scrolled = window.scrollY || window.pageYOffset;
   // Parallax effect
   hero.style.top = - (scrolled * 0.2) + 'px';
   // Apply CSS classes depending on scroll position
   if (hero.clientHeight < scrolled) {
      header.classList.remove('a');
      header.classList.add('b');
   }
   else if (0 < scrolled) {
      header.classList.add('a');
      header.classList.remove('b');
   }
   else {
      header.classList.remove('a');
      header.classList.remove('b');
   }
})

// Text effects on scroll
var text = [$('.left h1'), $('.left p'), $('.left a')];

window.addEventListener('scroll', function(e) {
   // Window scroll position
   var scrolled = window.scrollY || window.pageYOffset;
   // Parallax effect
   hero.style.top = - (scrolled * 0.2) + 'px';
   // Apply CSS classes depending on scroll position
   if (hero.clientHeight < scrolled) {
      text.forEach(element => {
         element.style.opacity = 1;
         element.style.top = 0;
      })
   }
   else {
      text.forEach(element => {
         element.style.opacity = 0;
         element.style.top = '10px';
      })
   }
})

// PWA Installation
let deferredInstallPrompt = null;

const installButton = $('.install');

installButton[0].addEventListener('click', installPWA);
installButton[1].addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Saves the event & shows install button.
function saveBeforeInstallPromptEvent(evt) {
  evt.preventDefault();
  deferredInstallPrompt = evt;
  installButton[0].classList.remove('disabled');
  installButton[1].classList.remove('disabled');
}


// Event handler for butInstall - Does the PWA installation.
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        installButton[0].classList.add('download');
        installButton[1].classList.add('download');
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredInstallPrompt = null;
    });
}

window.addEventListener('appinstalled', logAppInstalled);

// Log the installation to analytics or save the event somehow.
function logAppInstalled(evt) {
  console.log('Invest installed succesfully.', evt);
  window.location.href = '/';
}
