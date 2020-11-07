import { store } from 'react-notifications-component';

import {
    signUpFullTimeCT, signUpPartTimeCT, signUpPO, signUpPOFullTimeCT, signUpPOPartTimeCT
} from '../../database/PCSUserManager';

export const validateEmail = (email: string) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
};

export const hasEmptyFields = obj => {
    for (let key in obj) {
        if(key !== 'petName' && key !== 'petCategory' && key !== 'petSpecialReq' && key !== 'ctType'){
            if (obj[key] === "") {
                return true;
            }
        }
    }
    return false;
};

export const getRegions = () => {
    return  [
        {region: "West"},
        {region: "Central"},
        {region: "North"},
        {region: "North East"},
        {region: "East"},
    ]
}

export const signUp = async (regInfo: any, checkedPO: boolean, checkedCT: boolean, ctType: string) => {
    if (checkedPO && checkedCT) {
        if (ctType === '1') {
            try {
                const result = await signUpPOPartTimeCT(regInfo);
                return result;
            } catch (err) {
                return err;
            }
        } else if (ctType === '2') {
            try {
                const result = await signUpPOFullTimeCT(regInfo);
                return result;
            } catch (err) {
                return err;
            }
        }
    } else if (checkedPO) {
        try {
            const result = await signUpPO(regInfo);
            return result;
        } catch (err) {
            return err;
        }
    } else if (checkedCT) {
        if (ctType === '1') {
            try {
                const result = await signUpPartTimeCT(regInfo);
                return result;
            } catch (err) {
                return err;
            }
        } else if (ctType === '2') {
            try {
                const result = await signUpFullTimeCT(regInfo);
                return result;
            } catch (err) {
                return err;
            }
        }
    } else {
        return null;
    }
    return null;
}

export const notifySuccess = (message: string) => {
    const dismiss: any = {
        duration: 5000
    };

    store.addNotification({
        message: message,
        type: "success",
        container: "top-right",
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
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: dismiss
    });
};