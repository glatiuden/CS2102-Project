import { store } from 'react-notifications-component';


export const validateEmail = (email: string) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
};

export const hasEmptyFields = obj => {
    for (let key in obj) {
        if (obj[key] === "") {
            return true;
        }
    }
    return false;
};

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