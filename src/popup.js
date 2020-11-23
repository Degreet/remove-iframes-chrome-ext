'use strict';

import './popup.css';

const storage = {
  get: (key, cb) => {
    chrome.storage.sync.get(key, cb || (() => { }));
  },
  set: (data, cb) => {
    chrome.storage.sync.set(
      data,
      cb
    );
  },
};

function updateCounter({ type }) {
  counterStorage.get(count => {
    let newCount;

    if (type === 'INCREMENT') {
      newCount = count + 1;
    } else if (type === 'DECREMENT') {
      newCount = count - 1;
    } else {
      newCount = count;
    }

    counterStorage.set(newCount, () => {
      document.getElementById('counter').innerHTML = newCount;
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'COUNT',
            payload: {
              count: newCount,
            },
          },
          response => {
            console.log('Current count value passed to contentScript file');
          }
        );
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  removeBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          const removeEl = el => el.remove()
          document.querySelectorAll("div").forEach(removeEl)
        `
      });
    });
  });
});

chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Pop. I am from Popup.',
    },
  },
  response => {
    console.log(response.message);
  }
);