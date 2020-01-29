(function () {
  'use strict';

  /**
   * this is contentScript.js
   *
   * it has a scope of browser
   */
  chrome.runtime.sendMessage({ title: document.title, url: location.href }, response => console.log(response));

}());
