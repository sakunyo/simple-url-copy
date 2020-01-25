/**
 * this is popup.js
 */
const CONTENT_SCRIPT_PATH = 'dest/contentscript.js';

const getElement = (id: string) =>
  document.getElementById(id) as HTMLInputElement | null;

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  tabs => {
    const currentTab = tabs[0];

    if (currentTab && currentTab.id) {
      chrome.tabs.executeScript(currentTab.id, {file: CONTENT_SCRIPT_PATH});
    }
  },
);

const main = () => {
  const titleInputRef = getElement('title');
  const urlInputRef = getElement('url');

  if (titleInputRef && urlInputRef) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.title) {
        titleInputRef.value = request.title;
      }

      if (request.url) {
        urlInputRef.value = request.url;
      }

      sendResponse({farewell: 'goodbye'});
    });
  }
};

main();
