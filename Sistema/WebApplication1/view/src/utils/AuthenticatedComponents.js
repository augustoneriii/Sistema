import React from 'react';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import { useEffect, useState } from 'react';

function AuthenticatedComponents() {
    var token

    useEffect(() => {
        token = localStorage.getItem('token')
    }, [token])

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
