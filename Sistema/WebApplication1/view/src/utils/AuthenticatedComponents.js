import React from 'react';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';

function AuthenticatedComponents() {
    return (
        <>
            <SideBar />
            <ConvenioMedico />
            <Profissao />
            <Paciente />
        </>
    );
}

export default AuthenticatedComponents;
