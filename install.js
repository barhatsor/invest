'use strict';

let deferredInstallPrompt = null;

const installWrapper = document.querySelector('.install-wrapper');
const installButton = document.querySelector('.install');

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  evt.preventDefault();
  deferredInstallPrompt = evt;
  installWrapper.classList.remove('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  installButton.classList.add('download');
  deferredInstallPrompt.prompt();
  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        installWrapper.innerHTML = '<p>Adding...</p><img class="install download" alt="install" src="/images/plus.svg">';
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredInstallPrompt = null;
    });
}

window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
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
});
