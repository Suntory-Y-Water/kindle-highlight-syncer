import {
  MessageRequest,
  MessageResponse,
  PostNotionApiResponse,
  StartMessageRequest,
} from './types';

chrome.runtime.onMessage.addListener((request: StartMessageRequest, _sender, sendResponse) => {
  if (request.action === 'startExtension') {
    console.log('popupからのイベントを受信しました');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs
          .sendMessage<MessageRequest>(tabs[0].id, {
            action: 'getKindleHighlight',
          })
          .then(async (response: MessageResponse) => {
            if ((response.success = false)) {
              console.log('ハイライトが存在しません');
              sendResponse({ success: false, message: `ハイライトが存在しません。` });
              return;
            }
            console.log('Notionへ保存する処理を実行します。');
            const result = await postNotionData(response, request.apiKey, request.pageUrl);

            if (result.type === 'failure') {
              console.error(result.message);
              sendResponse({
                success: false,
                message: result.message,
              });
              return;
            }
            console.log('Notionへの保存が完了しました。');
            sendResponse({ success: true, message: result.message });
          })
          .catch((error: unknown) => {
            console.error(`エラーが発生しました : ${error}`);
            sendResponse({ success: false, message: `予期せぬエラーが発生しました。${error}` });
          });
      }
    });
    return true;
  }
});

const postNotionData = async (
  messageResponse: MessageResponse,
  apiKey: string,
  pageUrl: string,
): Promise<PostNotionApiResponse> => {
  const API_URL = 'https://api.notion.com/v1';
  const HEADERS = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  };

  try {
    if (!messageResponse.bookDetails) {
      console.error('ハイライトが存在しないため処理を終了します。');
      return { type: 'failure', message: 'ハイライトが存在しないため処理を終了します。' };
    }

    const children = messageResponse.bookDetails.map((detail) => [
      {
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: { content: detail.highlight },
            },
          ],
        },
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: detail.note },
            },
          ],
        },
      },
    ]);

    const response = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        parent: {
          type: 'page_id',
          page_id: pageUrl,
        },
        properties: {
          title: {
            type: 'title',
            title: [
              {
                type: 'text',
                text: { content: messageResponse.title },
              },
            ],
          },
        },
        children: children.flat(),
      }),
    });

    const data = await response.json();

    if (data.object === 'error') {
      console.error(data);
      return {
        type: 'failure',
        message: `Notionへの保存に失敗しました。`,
      };
    }

    return {
      type: 'success',
      message: `Notionの保存に成功しました。\n保存した本 : ${messageResponse.title}`,
    };
  } catch (error) {
    console.error(`例外が発生しました。Notionへの保存に失敗しました : ${error}`);
    return { type: 'failure', message: 'Notionへの保存に失敗しました。' };
  }
};
