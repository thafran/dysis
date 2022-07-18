console.log('background.js');

// Receive message from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  console.log(sender);
  console.log(sendResponse); // this is a function the receiver can call
  sendResponse("Received message on background");
  // Send message to content script (tab)
  chrome.tabs.sendMessage(sender.tab.id, "Got a message from background");
});
