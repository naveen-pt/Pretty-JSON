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

  });
});
