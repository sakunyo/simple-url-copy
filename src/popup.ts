/**
 * this is popup.js
 */
type NotNull<T extends object> = {
  [P in keyof T]: NonNullable<T[P]>;
};

const CONTENT_SCRIPT_PATH = 'dest/contentscript.js';

const getElement = function<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
};

const handleCopy = (input: HTMLInputElement) => {
  input.select();
  document.execCommand('copy');
};

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

type Item = {
  id: string;
  value: string;
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const generate = (id: string) => ({
    id,
    value: ((id, request) => {
      switch (id) {
        case 'md':
          return `[${request['title']}](${request['url']})`;
        default:
          return request[id];
      }
    })(id, request),
    input: getElement<HTMLInputElement>(id),
    button: getElement<HTMLButtonElement>(`btn-${id}`),
  });

  const filter = (item: Item): boolean => {
    return item.input !== null && item.button !== null;
  };

  const attach = (item: NotNull<Item>) => {
    item.input.value = item.value;
    item.button.addEventListener('click', () => handleCopy(item.input));
  };

  ['title', 'url', 'md']
    .map(generate)
    .filter((i: Item): i is NotNull<Item> => filter(i))
    .forEach(attach);

  sendResponse({farewell: 'goodbye'});
});
