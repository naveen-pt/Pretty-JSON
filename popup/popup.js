document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-extension');

  // Load the current state
  chrome.storage.sync.get('extensionEnabled', (data) => {
    toggle.checked = data.extensionEnabled !== false; // Default is true
  });

  // Toggle event
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ extensionEnabled: enabled });
    // Send a message to content.js to enable/disable the extension functionality
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: enabled ? 'enable' : 'disable' });
    });
  });
});
