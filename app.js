/* app.js

   (C) Bar Hatsor 2020
       MIT License (https://bassets.github.io/mit)
   */

var v = 1.1;

// Header effects on scroll
var header = document.querySelector('.header');
var hero = document.querySelector('.hero');

window.addEventListener('scroll', function(e) {
   if (window.scrollY > hero.clientHeight) {
      header.classList.add('a');
      header.classList.remove('b');
   }
   else if (window.scrollY > 0) {
      header.classList.remove('a');
      header.classList.add('b');
   }
   else {
      header.classList.remove('a');
      header.classList.remove('b');
   }
})

// PWA Installation
let deferredInstallPrompt = null;

const installButton = document.querySelectorAll('.install');

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
