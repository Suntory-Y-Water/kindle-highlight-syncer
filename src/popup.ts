import { BackgroundEventResponse, StartMessageRequest } from './types';

// ページロード時にローカルストレージからAPIキーとページURLを読み込む
document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.querySelector<HTMLInputElement>('#api-key');
  const pageUrlInput = document.querySelector<HTMLInputElement>('#page-url');

  const savedApiKey = localStorage.getItem('notionApiKey');
  const savedPageUrl = localStorage.getItem('notionPageUrl');

  if (!apiKeyInput || !pageUrlInput) {
    throw new Error('APIキーまたは親ページURLが見つかりません。');
  }

  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  if (savedPageUrl) {
    pageUrlInput.value = savedPageUrl;
  }
});

// Notionへ保存する！押下時のイベント
document.addEventListener('DOMContentLoaded', () => {
  const notionSendButton = document.getElementById('send-button');
  if (!notionSendButton) {
    throw new Error('send-buttonが見つかりません！');
  }

  notionSendButton.addEventListener('click', () => {
    const apiKey = document.querySelector<HTMLInputElement>('#api-key');
    const pageUrl = document.querySelector<HTMLInputElement>('#page-url');

    if (!apiKey || !pageUrl) {
      throw new Error('APIキーまたは親ページURLが見つかりません。');
    }

    if (apiKey.value === '' || pageUrl.value === '') {
      alert('APIキーと親ページURLを入力してください。');
      return;
    }

    localStorage.setItem('notionApiKey', apiKey.value);
    localStorage.setItem('notionPageUrl', pageUrl.value);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.runtime.sendMessage<StartMessageRequest>(
          {
            action: 'startExtension',
            apiKey: apiKey.value,
            pageUrl: pageUrl.value,
          },
          (response: BackgroundEventResponse) => {
            if (response) {
              alert(response.message);
            } else {
              alert('レスポンスがありませんでした。');
            }
          },
        );
      }
      console.log('backgroundにメッセージを送信しました！');
    });
  });
});
