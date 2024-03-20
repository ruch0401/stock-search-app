export class Alert {
  type: string;
  message: string;
  selfClosing: boolean;
  closeAfter: number;
  dismissible: boolean;

  constructor(
    type?: any,
    message?: any,
    selfClosing?: any,
    closeAfter?: any,
    dismissible?: any
  ) {
    this.type = type;
    this.message = message;
    this.selfClosing = selfClosing;
    this.closeAfter = closeAfter;
    this.dismissible = dismissible;
  }
}
