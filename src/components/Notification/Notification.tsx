import {showMessage} from 'react-native-flash-message';

export type MessageType =
  | 'none'
  | 'default'
  | 'info'
  | 'success'
  | 'danger'
  | 'warning';
export const openNotification = (type: MessageType, message: string) => {
  showMessage({
    type,
    message,
    autoHide: true,
    duration: 4000,
    icon: type,
  });
};
