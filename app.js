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
      header.style.background = '#111';
      header.style.boxShadow = 'inset 0 -1px 0 0 rgb(255 255 255 / 0.24)';
   }
   else if (window.scrollY > 0) {
      header.style.background = 'rgba(29,29,31,0.72)';
      header.style.backdropFilter = 'saturate(180%) blur(20px)';
      header.style.boxShadow = 'inset 0 -1px 0 0 rgb(255 255 255 / 0.24)';
   }
   else {
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.boxShadow = 'none';
   }
})

// PWA Installation
let deferredInstallPrompt = null;

const installButton = document.querySelector('.install');

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Saves the event & shows install button.
function saveBeforeInstallPromptEvent(evt) {
  evt.preventDefault();
  deferredInstallPrompt = evt;
  installButton.classList.remove('disabled');
}


// Event handler for butInstall - Does the PWA installation.
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        installButton.classList.add('download');
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
