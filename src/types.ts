export interface MessageRequest {
  action: 'getKindleHighlight' | 'startExtension';
}

export interface StartMessageRequest extends MessageRequest {
  apiKey: string;
  pageUrl: string;
}

export interface MessageResponse {
  success: boolean;
  title: string;
  bookAuthor: string;
  bookDetails: { highlight: string; note: string }[];
}

export interface PostNotionApiResponse {
  type: 'failure' | 'success';
  message: string;
}

export interface BackgroundEventResponse {
  success: boolean;
  message: string;
}
