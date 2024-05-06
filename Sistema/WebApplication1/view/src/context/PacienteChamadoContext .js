import React, { createContext, useState, useContext } from 'react';

const PacienteChamadoContext = createContext();

export const PacienteChamadoProvider = ({ children }) => {
    const [pacienteChamado, setPacienteChamado] = useState(null);

    return (
        <PacienteChamadoContext.Provider value={{ pacienteChamado, setPacienteChamado }}>
            {children}
        </PacienteChamadoContext.Provider>
    );
};

export const usePacienteChamado = () => useContext(PacienteChamadoContext);
