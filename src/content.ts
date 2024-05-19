import { MessageRequest } from './types';

// ハイライトとメモを取得するイベント
chrome.runtime.onMessage.addListener(async (request: MessageRequest, _sender, sendResponse) => {
  if (request.action === 'getKindleHighlight') {
    const bookTitle = document.querySelector(
      '#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span5 > h3',
    );

    const bookAuthor = document.querySelector(
      '#annotation-scroller > div > div.a-row.a-spacing-base.kp-notebook-row-separator > div.a-column.a-span9.a-span-last > div:nth-child(3) > span',
    );

    const highlightElements = document.querySelectorAll('#highlight.a-size-base-plus.a-color-base');
    const noteElements = document.querySelectorAll('#note.a-size-base-plus.a-color-base');

    if (highlightElements.length === 0) {
      console.log('ハイライトが存在しません');
      sendResponse({ success: false, bookDetails: [] });
      return false;
    }

    const bookDetails = Array.from(highlightElements).map((highlightElement, index) => {
      const noteElement = noteElements[index];
      return {
        highlight: highlightElement.textContent?.trim() || '',
        note: noteElement ? noteElement.textContent?.trim() || '' : '',
      };
    });

    sendResponse({
      success: true,
      title: bookTitle?.textContent || '',
      bookAuthor: bookAuthor?.textContent || '',
      bookDetails,
    });

    return true;
  }
});
