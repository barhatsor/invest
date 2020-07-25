'use strict';

let deferredInstallPrompt = null;

const installWrapper = document.querySelector('.install-wrapper');
const installButton = document.querySelector('.install');

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Saves the event & shows install button.
function saveBeforeInstallPromptEvent(evt) {
  evt.preventDefault();
  deferredInstallPrompt = evt;
  installWrapper.classList.remove('hidden');
}


// Event handler for butInstall - Does the PWA installation.
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        installWrapper.classList.add('download');
        setTimeout(function() {
          document.querySelector('.install-wrapper p').innerHTML = "Adding...";
          installWrapper.style.color = "#fff";
        }, 200);
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
  installWrapper.classList.add('hidden');
  console.log('Invest installed succesfully.', evt);
}

window.addEventListener('DOMContentLoaded', () => {
  let displayMode = 'browser tab';
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
  // Log launch display mode to analytics
  console.log('DISPLAY_MODE_LAUNCH:', displayMode);
  if (displayMode == 'browser tab') {
    window.location.href = '/app';
  }
});
