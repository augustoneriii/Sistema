import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import Consulta from '../pages/Consulta';
import Profissional from '../pages/Profissional';
import { SidebarContext } from '../context/SideBarContext'; 

function AuthenticatedComponents() {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const {
        convenioVisible,
        profissaoVisible,
        pacienteVisible,
        consultaVisible,
        profissionalVisible
    } = useContext(SidebarContext); 

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);

        if (!tokenFromStorage) {
            navigate('/');
        }
    }, [navigate]);

    return token ? (
        <>
            <SideBar />
            {convenioVisible && <ConvenioMedico />}
            {profissionalVisible && <Profissional />}
            {consultaVisible && <Consulta />}
            {profissaoVisible && <Profissao />}
            {pacienteVisible && <Paciente />}
        </>
    ) : null;
}

export default AuthenticatedComponents;
