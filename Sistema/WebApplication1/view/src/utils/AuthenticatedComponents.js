import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import Consulta from '../pages/Consulta';
import Profissional from '../pages/Profissional';

function AuthenticatedComponents() {
    const [token, setToken] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);

        if (!tokenFromStorage) {
            navigate('/')
        }
    }, []); 

    return token ? (
        <>
            <SideBar />
            <ConvenioMedico />
            <Profissional />
            <Consulta />
            <Profissao />
            <Paciente />
        </>
    ) : null;
}

export default AuthenticatedComponents;
