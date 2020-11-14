import { store } from 'react-notifications-component';

export const notifySuccess = (message: string) => {
    const dismiss: any = {
        duration: 5000
    };

    store.addNotification({
        message: message,
        type: "success",
        container: "bottom-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: dismiss
    });
};

export const notifyFailure = (message: string) => {
    const dismiss: any = { duration: 5000, click: true, showIcon: true };
    store.addNotification({
        message: message,
        type: "danger",
        container: "bottom-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: dismiss
    });
};