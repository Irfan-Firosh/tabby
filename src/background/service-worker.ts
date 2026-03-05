chrome.action.onClicked.addListener((tab) => {
  if (tab.id !== undefined) chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  console.log('Tabby installed');
});
