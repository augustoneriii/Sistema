// Crie um contexto para o estado compartilhado
import React, { createContext, useContext, useState } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
    const [modalData, setModalData] = useState(null);

    const setModal = (data) => {
        setModalData(data);
    };

    return (
        <SharedStateContext.Provider value={{ modalData, setModal }}>
            {children}
        </SharedStateContext.Provider>
    );
};

export const useSharedState = () => useContext(SharedStateContext);
