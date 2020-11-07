import React, { useState } from 'react';
import { PetOwns } from '../database/PetOwnsManager';

const initialState = {
    petCategories: [] as PetOwns[],
    setPetCategories: (obj) => {}
}

export const PetOwnerContext = React.createContext(initialState);

export const PetOwnerContextProvider = (props) => {
    const [petCategories, setPetCategories] = useState([]);

    return (
        <PetOwnerContext.Provider
            value={{
                petCategories,
                setPetCategories
            }}>
            {props.children}
        </PetOwnerContext.Provider>
    );
};

export const PetOwnerContextConsumer = PetOwnerContext.Consumer;
