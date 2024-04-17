import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [convenioVisible, setConvenioVisible] = useState(false);
    const [profissaoVisible, setProfissaoVisible] = useState(false);
    const [pacienteVisible, setPacienteVisible] = useState(false);
    const [consultaVisible, setConsultaVisible] = useState(false);
    const [profissionalVisible, setProfissionalVisible] = useState(false);

    return (
        <SidebarContext.Provider
            value={{
                visible, setVisible,
                convenioVisible, setConvenioVisible,
                profissaoVisible, setProfissaoVisible,
                pacienteVisible, setPacienteVisible,
                consultaVisible, setConsultaVisible,
                profissionalVisible, setProfissionalVisible
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
