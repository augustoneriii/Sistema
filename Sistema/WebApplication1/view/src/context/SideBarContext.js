import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [convenioVisible, setConvenioVisible] = useState(false);
    const [profissaoVisible, setProfissaoVisible] = useState(false);
    const [pacienteVisible, setPacienteVisible] = useState(false);
    const [consultaVisible, setConsultaVisible] = useState(false);
    const [profissionalVisible, setProfissionalVisible] = useState(false);
    const [usuarioVisible, setUsuarioVisible] = useState(false);
    const [perfilVisible, setPerfilVisible] = useState(false);
    const [agendaProfissionalVisible, setAgendaProfissionalVisible] = useState(false);
    const [atendimentoVisible, setAtendimentoVisible] = useState(false);
    const [agendaCalendarioVisible, setAgendaCalendarioVisible] = useState(false);
    const [relatorioVisible, setRelatorioVisible] = useState(false);
    const [prontuarioVisible, setProntuarioVisible] = useState(false);
    return (
        <SidebarContext.Provider
            value={{
                visible, setVisible,
                convenioVisible, setConvenioVisible,
                profissaoVisible, setProfissaoVisible,
                pacienteVisible, setPacienteVisible,
                consultaVisible, setConsultaVisible,
                profissionalVisible, setProfissionalVisible,
                usuarioVisible, setUsuarioVisible,
                perfilVisible, setPerfilVisible,
                agendaProfissionalVisible, setAgendaProfissionalVisible,
                atendimentoVisible, setAtendimentoVisible,
                agendaCalendarioVisible, setAgendaCalendarioVisible,
                relatorioVisible, setRelatorioVisible,
                prontuarioVisible, setProntuarioVisible
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
