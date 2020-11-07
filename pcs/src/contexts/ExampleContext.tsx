import React, { useState } from 'react';

export interface IState {
    //Can add anything that you need information to pass / be persistent
    valueToBeStored: string;
    setValueToBeStored: React.Dispatch<React.SetStateAction<string>>;
}

const initialState = {
    valueToBeStored: "",
    setValueToBeStored: {} as React.Dispatch<React.SetStateAction<string>>,
} as IState;

export const ExampleContext = React.createContext<IState>(initialState);

export const ExampleContextProvider = (props) => {
    const [valueToBeStored, setValueToBeStored] = useState<string>("");

    return (
        <ExampleContext.Provider
            value={{
                valueToBeStored,
                setValueToBeStored
            }}>
            {props.children}
        </ExampleContext.Provider>
    );
};

export const ExampleContextConsumer = ExampleContext.Consumer;
