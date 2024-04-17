import React from 'react';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import Consulta from '../pages/Consulta';
import { useEffect, useState } from 'react';
import Profissional from '../pages/Profissional';

function AuthenticatedComponents() {
    var token

    useEffect(() => {
        token = localStorage.getItem('token')
    }, [token])

    return (
        <>
            <SideBar />
            <ConvenioMedico />
            <Profissional />
            <Consulta />
            <Profissao />
            <Paciente />
        </>
    );
}

export default AuthenticatedComponents;
