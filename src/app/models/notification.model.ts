export class Notification {
  message: string;
  category: string;
  type: NotificationType;
  url?: string;

  constructor(message: string, category: string, type: NotificationType, url?: string) {
    this.message = message;
    this.category = category;
    this.url = url;
  }
}

export type NotificationType = 'ERROR' | 'SUCCESS';
