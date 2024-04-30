import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { HomeService } from './service/HomeService';
import Modal from '../../components/Modal';




const localizer = momentLocalizer(moment);
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

    const formatConsultasForCalendar = () => {
        return consultas.map(consulta => {
            let backgroundColor;
            switch (consulta.status) {
                case 'Agendada':
                    backgroundColor = '#76BFAC';
                    break;
                case 'Cancelada':
                    backgroundColor = ' #EA5846';
                    break;
                case 'Realizada':
                    backgroundColor = '#6161EB';
                    break;
                default:
                    backgroundColor = 'gray';
                    break;
            }

            return {
                title:  consulta.profissionais.nome,
                start: moment(consulta.data).toDate(),
                end: moment(consulta.data).add(1, 'hour').toDate(), // Adicione a duração da consulta, se aplicável
                backgroundColor: backgroundColor,
                consultaData: consulta // Adiciona os dados da consulta ao evento
            };
        });
    };


    const handleConsultaClick = (event) => {
        const consultaData = event.consultaData; // Obtém os dados da consulta associados ao evento clicado
        setConsultaSelecionada(consultaData);
        setConsultaDialogVisible(true);
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

            <Calendar
                localizer={localizer}
                events={formatConsultasForCalendar()}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                BackgroundWrapper=""
                onSelectEvent={handleConsultaClick}
                eventPropGetter={(event) => {
                    return {
                        style: {
                            backgroundColor: event.backgroundColor,
                            color: event.color
                        }
                    };
                }}
            />



            <Modal
                header={<h2>Detalhes da Consulta</h2>}
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
                            <p className='text-xl'> {moment(consultaSelecionada.data).format('DD-MM-YYYY')}</p>
                        </div>
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Hora:</h5>
                            <p className='text-xl'> {moment(consultaSelecionada.hora).format('HH:mm:ss')}</p>
                        </div>
                        <hr />
                        <hr />
                        <div className='col-12 flex gap-3'>
                            <h5 className='text-xl'>Status:</h5>
                            <p className='text-xl'>{consultaSelecionada.status}</p>
                        </div>
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