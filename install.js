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
  deferredInstallPrompt = evt;
  installWrapper.classList.remove('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  // Hide the install button, it can't be called twice.
  installWrapper.classList.add('hidden');
  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choice);
      } else {
        console.log('User dismissed the A2HS prompt', choice);
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
  console.log('Invest installed succesfully.', evt);
}
