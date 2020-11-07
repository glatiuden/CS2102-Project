import 'react-notifications-component/dist/theme.css';

import React, { useEffect } from 'react';
import { store } from 'react-notifications-component';

import { PCSUser, signInUser, updateUser, signUpPO } from '../database/PCSUserManager';

interface IState {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
    isAuthenticated: boolean;
    user?: PCSUser;
    signIn: (creds: any) => Promise<boolean>;
    onSignInSuccess: (user: any, email: string) => Promise<void>;
    signOut: () => Promise<void>;
    notifySuccess: (message: string) => void;
    notifyDanger: (message: string) => void;
    handleError: (error: Error, message?: string) => void;
    updateUserReducer: (updateInfo: any) => Promise<boolean>;
}

interface IAction {
    type: string;
    payload?: any;
}

const initialState = {
    isLoading: false,
    setLoading: {} as any,
    isAuthenticated: JSON.parse(localStorage.getItem("userToken") as string) == null ? false : true,
    user: JSON.parse(localStorage.getItem("userToken") as string),
    signIn: {} as any,
    onSignInSuccess: {} as any,
    signOut: {} as any,
    notifySuccess: {} as any,
    notifyDanger: {} as any,
    handleError: {} as any,
    classes: {} as any,
    updateUserReducer: {} as any,
} as IState;

export const AppContext = React.createContext(initialState);

const reducer = (state: IState, action: IAction) => {
    switch (action.type) {
        case "onUserLoggingIn":
            return { ...state, isLoading: true };
        case "onUserNotLoggedIn":
            return {
                ...state,
                isLoading: false
            };
        case "onUserLoggedIn":
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload
            };
        case "onUserLoggedOut":
            return {
                ...initialState,
                isLoading: false,
                isAuthenticated: false,
                user: undefined
            };
        case "setLoading":
            return { ...state, isLoading: action.payload };
        case "updateUser": {
            return {
                ...state,
                user: action.payload
            };
        }
        default:
            return state;
    }
};

export const AppContextProvider = (props: any) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const init = async () => {
    };

    useEffect(() => {
        init();
    }, []);

    const updateUserReducer = async (updateInfo) => {
        try {
            const result = await updateUser(updateInfo);
            if (result) {
                dispatch({
                    type: "updateUser",
                    payload: updateInfo
                });
                notifySuccess("Update Successfully");
                localStorage.setItem("userToken", JSON.stringify(updateInfo));
                return true;
            } else {
                notifyDanger("Update Failed!");
            }
        } catch (err) {
            notifyDanger(err);
        }
        return false;
    };

    const signIn = async (creds) => {
        try {
            const _user = await signInUser(creds);
            if (_user) {
                dispatch({
                    type: "onUserLoggedIn",
                    payload: _user
                });
                notifySuccess("Logged in successfully.");
                localStorage.setItem("userToken", JSON.stringify(_user));
                return true;
            } else {
                notifyDanger("Invalid account/password.");
            }
        } catch (err) {
            notifyDanger("Invalid account/password.");
        }
        return false;
    };

    const onSignInSuccess = async (user) => {
        dispatch({
            type: "onUserLoggedIn",
            payload: user
        });
    };

    const signOut = async () => {
        // await Auth.signOut();
        localStorage.removeItem("userToken");
        dispatch({
            type: "onUserLoggedOut"
        });
    };

    const notifySuccess = (message: string) => {
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

    const notifyDanger = (message: string) => {
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

    const handleError = (error: Error, message?: string) => {
        console.log(error);
        notifyDanger(message ? message : error.message);
    }

    return (
        <>
            <AppContext.Provider
                value={{
                    ...state,
                    signIn,
                    onSignInSuccess,
                    signOut,
                    notifySuccess,
                    notifyDanger,
                    handleError,
                    updateUserReducer,
                }}
            >
                {props.children}
            </AppContext.Provider>
        </>
    );
};
