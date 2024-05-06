import React, { createContext, useState, useContext } from 'react';

const PacienteChamadoContext = createContext();

export const PacienteChamadoProvider = ({ children }) => {
    const [pacienteChamado, setPacienteChamado] = useState(null);
    const [modalData, setModalData] = useState(null);

    const setPaciente = (data) => {
        setPacienteChamado(data);
    };
    return (
        <PacienteChamadoContext.Provider value={{ pacienteChamado, setPacienteChamado, modalData, setPaciente }}>
            {children}
        </PacienteChamadoContext.Provider>
    );
};

export const usePacienteChamado = () => useContext(PacienteChamadoContext);
