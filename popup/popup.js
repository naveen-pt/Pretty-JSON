document.getElementById('click-me').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          alert('Hello from the extension popup!');
          // Call the function to prettify JSON
        }
      });
    } else {
      console.error('No active tab found.');
    }
  });
});
