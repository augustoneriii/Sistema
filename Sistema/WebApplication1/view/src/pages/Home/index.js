import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt';
import { ConsultaService } from '../Consulta/service/ConsultaService';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [consultas, setConsultas] = useState([]);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [consultaDialogVisible, setConsultaDialogVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchConsultas(token);
        }
    }, [navigate]);

    const fetchConsultas = async (token) => {
        try {
            const response = await ConsultaService.getConsultas(token);
            setConsultas(response.data);
        } catch (error) {
            console.error('Erro ao obter consultas:', error);
        }
    };

    const handleConsultaClick = (info) => {
        const consulta = consultas.find(consulta => new Date(consulta.data).toISOString() === info.event.start.toISOString());
        setConsultaSelecionada(consulta);
        setConsultaDialogVisible(true);
    };

    const formatConsultasForCalendar = () => {
        return consultas.map(consulta => ({
            title: 'Consulta',
            start: new Date(consulta.data).toISOString(),
            backgroundColor: getEventColor(consulta.status)
        }));
    };

    const getEventColor = (status) => {
        switch (status) {
            case 'Agendada':
                return 'green';
            case 'Cancelada':
                return 'red';
            case 'Realizada':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        return formattedTime;
    };

    return (
        <div className="text-center h-screen w-50 m-auto">
            <h1>Home</h1>
            <h2>Seja bem-vindo {user.userName}</h2>
            <h3>{user.idUserRole}</h3>
            <hr />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={formatConsultasForCalendar()}
                eventClick={handleConsultaClick}
                locale={ptLocale}
            />

            <Dialog header="Detalhes da Consulta" visible={consultaDialogVisible} onHide={() => setConsultaDialogVisible(false)}>
                {consultaSelecionada && (
                    <div>
                        <h3>Detalhes da Consulta:</h3>
                        <p>Profissional:</p>
                        <p> {consultaSelecionada.profissionais.nome}</p>
                        <hr />
                        <p>Paciente:</p>
                        <p>{consultaSelecionada.pacientes.nome}</p>
                        <hr />
                        <p>Data:</p>
                        <p> {formatDate(consultaSelecionada.data)}</p>
                        <hr />
                        <p>Hora:</p>
                        <p> {formatTime(consultaSelecionada.hora)}</p>
                        <hr />
                        <p>Observações:</p>
                        <p>{consultaSelecionada.observacoes}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
}

export default Home;
