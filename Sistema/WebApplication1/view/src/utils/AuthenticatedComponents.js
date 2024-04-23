import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import Consulta from '../pages/Consulta';
import Profissional from '../pages/Profissional';
import Usuarios from '../pages/CadastrosBasicos/Usuarios';
import Perfil from '../pages/CadastrosBasicos/Perfil';
import AgendaProfissional from '../pages/CadastrosBasicos/AgendaProfissional';
import { SidebarContext } from '../context/SideBarContext';


function AuthenticatedComponents() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({ idUserRole: '' });

    const navigate = useNavigate();
    const {
        convenioVisible,
        profissaoVisible,
        pacienteVisible,
        consultaVisible,
        profissionalVisible,
        usuarioVisible,
        perfilVisible,
        agendaProfissionalVisible
    } = useContext(SidebarContext);

    useEffect(() => {
        const userFromStorage = JSON.parse(localStorage.getItem('user'));
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);
        setUser(userFromStorage);

        if (!tokenFromStorage) {
            navigate('/');
        }
    }, [navigate]);

    return token ? (
        <>
            <SideBar idUserRole={user.idUserRole} />
            {user.idUserRole === "c8fffd" ? (
                <>
                    {perfilVisible && <Perfil />}
                    {agendaProfissionalVisible && <AgendaProfissional />}
                    {perfilVisible && <Perfil />}
                </>
            ) : (
                <>
                    {convenioVisible && <ConvenioMedico />}
                    {profissionalVisible && <Profissional />}
                    {consultaVisible && <Consulta />}
                    {profissaoVisible && <Profissao />}
                    {pacienteVisible && <Paciente />}
                    {usuarioVisible && <Usuarios />}
                    {agendaProfissionalVisible && <AgendaProfissional />}
                    {perfilVisible && <Perfil />}
                </>
            )}
        </>
    ) : null;
}

export default AuthenticatedComponents;
