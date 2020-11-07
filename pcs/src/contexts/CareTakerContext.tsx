import 'react-notifications-component/dist/theme.css';

import React, { useEffect } from 'react';
import { store } from 'react-notifications-component';

import { signUpAsFtCareTaker } from '../database/CareTakerManager';

const initialState = {
    isLoading: false,
    setLoading: {} as any,
    isCareTaker: false,
    onSignUpAsFtCareTakerClick: {} as any,
    notifySuccess: {} as any,
    notifyDanger: {} as any,
    handleError: {} as any
};

export const CareTakerContext = React.createContext(initialState);

const reducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export const CareTakerContextProvider = (props: any) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const init = async () => {
    };

    useEffect(() => {
        init();
    }, []);

    // const signIn = async (creds) => {
    //     try {
    //         const _user = await signInUser(creds);
    //         if (_user) {
    //             dispatch({
    //                 type: "onUserLoggedIn",
    //                 payload: _user
    //             });
    //             notifySuccess("Logged in successfully.");
    //             localStorage.setItem("userToken", JSON.stringify(_user));
    //             return true;
    //         } else {
    //             notifyDanger("Invalid account/password.");
    //         }
    //     } catch (err) {
    //         notifyDanger("Invalid account/password.");
    //     }
    //     return false;
    // };

    const onSignUpAsFtCareTakerClick = async (e, user) => {
        e.preventDefault();
        if (user) {
          const insertSuccess = await signUpAsFtCareTaker(user.email, user.name);
          if (insertSuccess) {
            console.log("Signed up as FT");
          } else {
            notifyDanger("Failed to sign up as FT");
          }
        }
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
            <CareTakerContext.Provider
                value={{
                    ...state,
                    onSignUpAsFtCareTakerClick,
                    notifySuccess,
                    notifyDanger,
                    handleError
                }}
            >
                {props.children}
            </CareTakerContext.Provider>
        </>
    );
};
