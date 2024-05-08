import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { HomeService } from './service/HomeService';
import 'moment-timezone'
import 'moment/locale/pt-br';
import { Dialog } from 'primereact/dialog';





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
        const interval = setInterval(fetchConsulta, 30); 
        return () => clearInterval(interval); 
    }, []);

    moment.tz.setDefault('America/Cuiaba')
    moment.locale('pt-br');


    const localizer = momentLocalizer(moment)

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

    const messages = {
        allDay: 'Todo o dia',
        previous: 'Anterior',
        next: 'Próximo',
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda',
        date: 'Data',
        time: 'Hora',
        event: 'Consulta',
        showMore: total => `+ Ver mais (${total})`
    };

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
                    backgroundColor = '#EA5846';
                    break;
                case 'Realizada':
                    backgroundColor = '#6161EB';
                    break;
                default:
                    backgroundColor = 'gray';
                    break;
            }

            const startDate = consulta.data;
            const startTime = consulta.hora;

            const fullStartDate = moment.tz(startDate, 'America/Cuiaba').set({
                hour: moment(startTime).hour(),
                minute: moment(startTime).minute(),
                second: moment(startTime).second()
            });

            const startDateTime = fullStartDate.toDate();
            const endDateTime = moment(startDateTime).add(1, 'hour').toDate();

            return {

                title: `Paciente: ${consulta.pacientes.nome}`, 
                start: startDateTime,
                end: endDateTime,
                backgroundColor: backgroundColor,
                consultaData: consulta
            };
        });
    };



    const handleConsultaClick = (event) => {
        const consultaData = event.consultaData;
        setConsultaSelecionada(consultaData);
        setConsultaDialogVisible(true);
    };



    return (
        <div className="text-center h-screen w-50 m-auto">
            <h2 className='pt-4'>Seja Bem-Vindo {user.userName}</h2>
            <hr />
            <Calendar
                localizer={localizer}
                style={{ height: '70vh' }}
                events={formatConsultasForCalendar()}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                messages={messages}
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
                tooltipAccessor={(event) => {
                    const consultaData = event.consultaData;
                    return `${moment(consultaData.hora).format('HH:mm')} - ${consultaData.tipo} - DR: ${consultaData.profissionais.nome}`;
                }}
            />




            <Dialog
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
            </Dialog>
        </div>
    );
}

export default Home;