import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt';
import { HomeService } from './service/HomeService'
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import Modal from '../../components/Modal';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [consultas, setConsultas] = useState([]);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [consultaDialogVisible, setConsultaDialogVisible] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [profissionais, setProfissionais] = useState([]);

    useEffect(() => {
        fetchConsulta();
    }, []);

    async function fetchConsulta() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            if ((user.idUserRole === "f8abf4" || user.idUserRole == "f8abf4") || (user.idUserRole === "f3f629" || user.idUserRole == "f3f629")) {
                const response = await HomeService.getConsultas(currentToken, ``);

                const consultasComIdProfissional = response.data.map(consulta => {
                    return consulta

                }).filter(consulta => consulta !== null);
                setConsultas(consultasComIdProfissional);
                setDataLoaded(true);

            } else {
                const response = await HomeService.getConsultas(currentToken, `?Profissionais.Cpf=${user.cpf}`);

                const consultasComIdProfissional = response.data.map(consulta => {
                    if (consulta.profissionais.cpf === user.cpf)
                        return { ...consulta, profissionalId: consulta.profissionais.id };

                }).filter(consulta => consulta !== null);
                setConsultas(consultasComIdProfissional);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error("Erro ao buscar consulta", error);
        }
    }


    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        HomeService.getProfissionais(currentToken, `Cpf=${user.cpf}`)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const handleConsultaClick = (info) => {
        const consulta = consultas.find(consulta => new Date(consulta.data).toISOString() === info.event.start.toISOString());
        setConsultaSelecionada(consulta);
        setConsultaDialogVisible(true);
    };

    const formatConsultasForCalendar = () => {
        if ((user.idUserRole === "f8abf4" || user.idUserRole == "f8abf4") || (user.idUserRole === "f3f629" || user.idUserRole == "f3f629")) {
            const todasAsConsultas = consultas;
            return todasAsConsultas.map(consulta => ({
                title: 'Consulta',
                start: new Date(consulta.data).toISOString(),
                backgroundColor: getEventColor(consulta.status)
            }));

        } else {
            const consultasDoProfissional = consultas.filter(consulta => {
                if (Array.isArray(consulta.profissionais)) {
                    return consulta.profissionais.some(profissional => profissional.cpf === user.cpf);
                } else {
                    return consulta.profissionais.cpf === user.cpf;
                }
            });

            return consultasDoProfissional.map(consulta => ({
                title: 'Consulta',
                start: new Date(consulta.data).toISOString(),
                backgroundColor: getEventColor(consulta.status)
            }));
        }
    }


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

    const header = (
        <>
            <h2>Detalhes da Consulta</h2>
            <hr />
        </>
    );

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
            <h2 className='pt-4'>Seja Bem-Vindo {user.userName}</h2>
            <hr />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={formatConsultasForCalendar()}
                eventClick={handleConsultaClick}
                locale={ptLocale}
            />

            <Modal
                header={header}
                visible={consultaDialogVisible}
                onHide={() => setConsultaDialogVisible(false)}
            >

                {consultaSelecionada && (
                    <div className='grid'>
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Profissional:</h5>
                            <p className='text-xl'> {consultaSelecionada.profissionais.nome}</p>
                        </div>
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Paciente:</h5>
                            <p className='text-xl'>{consultaSelecionada.pacientes.nome}</p>
                        </div>
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Data:</h5>
                            <p className='text-xl'> {formatDate(consultaSelecionada.data)}</p>
                        </div>
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Hora:</h5>
                            <p className='text-xl'> {formatTime(consultaSelecionada.hora)}</p>
                        </div>
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Observações:</h5>
                            <p className='text-xl'>{consultaSelecionada.observacoes}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Home;
