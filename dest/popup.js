(function () {
  'use strict';

  const CONTENT_SCRIPT_PATH = 'dest/contentscript.js';
  const getElement = function (id) {
      return document.getElementById(id);
  };
  const handleCopy = (input) => {
      input.select();
      document.execCommand('copy');
  };
  chrome.tabs.query({
      active: true,
      currentWindow: true,
  }, tabs => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.id) {
          chrome.tabs.executeScript(currentTab.id, { file: CONTENT_SCRIPT_PATH });
      }
  });
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const generate = (id) => ({
          id,
          value: ((id, request) => {
              switch (id) {
                  case 'md':
                      return `[${request['title']}](${request['url']})`;
                  default:
                      return request[id];
              }
          })(id, request),
          input: getElement(id),
          button: getElement(`btn-${id}`),
      });
      const filter = (item) => {
          return item.input !== null && item.button !== null;
      };
      const attach = (item) => {
          item.input.value = item.value;
          item.button.addEventListener('click', () => handleCopy(item.input));
      };
      ['title', 'url', 'md']
          .map(generate)
          .filter((i) => filter(i))
          .forEach(attach);
      sendResponse({ farewell: 'goodbye' });
  });

}());
