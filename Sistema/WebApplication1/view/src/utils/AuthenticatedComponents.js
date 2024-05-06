import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import ConvenioMedico from '../pages/CadastrosBasicos/ConvenioMedico';
import Profissao from '../pages/CadastrosBasicos/Profissao';
import Paciente from '../pages/Paciente';
import Consulta from '../pages/Agendamento/Consulta';
import Profissional from '../pages/Profissional';
import AgendaCalendario from '../pages/Agendamento/AgendaCalendario';
import Usuarios from '../pages/CadastrosBasicos/Usuarios';
import Perfil from '../pages/CadastrosBasicos/Perfil';
import AgendaProfissional from '../pages/Profissional/AgendaProfissional';
import { SidebarContext } from '../context/SideBarContext';
import ListaAtendimentos from '../pages/Profissional/ListaAtendimento';
import Relatorio from '../pages/Profissional/Relatorio/index';
import ConfirmaConsulta from '../pages/Agendamento/ConfirmaConsulta';
 

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
        agendaProfissionalVisible,
        atendimentoVisible,
        agendaCalendarioVisible,
        relatorioVisible,
        confirmaConsultaVisible
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
                    {atendimentoVisible && <ListaAtendimentos />}
                    {agendaCalendarioVisible && <AgendaCalendario />}
                </>
            ) : (
                <>
                    {convenioVisible && <ConvenioMedico />}
                    {profissionalVisible && <Profissional />}
                    {relatorioVisible && <Relatorio /> }
                    {consultaVisible && <Consulta />}
                    {profissaoVisible && <Profissao />}
                    {pacienteVisible && <Paciente />}
                    {usuarioVisible && <Usuarios />}
                    {agendaProfissionalVisible && <AgendaProfissional />}
                    {perfilVisible && <Perfil />}
                    {atendimentoVisible && <ListaAtendimentos />}
                    {agendaCalendarioVisible && <AgendaCalendario />}
                    {confirmaConsultaVisible && <ConfirmaConsulta />}
                </>
            )}
        </>
    ) : null;
}

export default AuthenticatedComponents;
